const inquirer = require('inquirer')
const chalk = require('chalk')
const fs = require('fs')
const Rsync = require('rsync')

async function promptUser () {
  const user = await inquirer.prompt({
    message: 'E-Mail-User:',
    name: 'user'
  })
  return user.user
}

async function promptAddEmail () {
  const email = await inquirer.prompt({
    message: 'Type in E-Mail-Adress to forward to:',
    name: 'email'
  })
  return email.email
}

async function promptAskEmail () {
  const yesNo = await inquirer.prompt({
    message: 'Do you want to add another E-Mail-Address?',
    type: 'confirm',
    name: 'yesNo'
  })
  return yesNo.yesNo
}

function createQmailContent (user, emails) {
  const emailsString = emails.join('\n')
  return `
# Weiterleitungen
${emailsString}

# Mails an ${user} in einem separaten IMAP-Ordner
./Maildir/.${user}/
`
}

module.exports = async (serverName, config) => {
  console.log(chalk.cyan(`Setup E-Mail-Adresses for Forwading on ${serverName}-Server!`))
  const user = await promptUser()
  const emails = [await promptAddEmail()]

  let addMore = await promptAskEmail()
  while (addMore) {
    emails.push(await promptAddEmail())
    addMore = await promptAskEmail()
  }

  const content = createQmailContent(user, emails)
  const name = `.qmail-${user}`
  const path = `${config.local.location.root}/${name}`

  fs.writeFile(path, content, (err) => {
    if (err) return console.log(err)
  })

  const ssh = config[serverName].ssh
  // Build the command
  var rsync = new Rsync()
    .shell('ssh')
    .flags('az')
    .source(path)
    .destination(`${ssh.user}@${ssh.host}:~`)

  rsync.execute(function (error, code, cmd) {
    if (error) console.log(error)
    fs.unlinkSync(path)
  })
}
