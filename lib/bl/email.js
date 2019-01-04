// send an email using an
// microservice emailer

const http = require('http')
const url = require('url')

const emailUrl = new url.URL(process.env.EMAIL_URL || 'http://emailer:8080/email')

function sendEmail(to, subject, body) {
    
    // API input, send a JSON
    // containing to, subject and body
    // of the email
    var reqBody = JSON.stringify({
        to: to.toString(), subject: subject.toString(), body: body.toString()
    })
    var reqOptions = {
        method: 'POST',
        hostname: emailUrl.hostname, port: emailUrl.port, path: emailUrl.pathname,
        headers: { 'Content-Type': 'application/json', 'Content-Length': reqBody.length }
    }

    // construct a Promise to
    // make a request to the API
    var reqPromise = new Promise((resolve, reject) => {
        var req = http.request(reqOptions, res => {
            var data = ''
            res.on('data', chunk => { data += chunk })
            res.on('end', () => { resolve(JSON.parse(data)) })
            res.on('error', reject)
        })
        // send the POST body
        req.write(reqBody)
        req.end()
    })
    
    // return the promise so that it 
    // can be awaited in an async fn
    return reqPromise
}

module.exports = sendEmail

// async function main() {
//     try {
//         console.log(await sendEmail('x@y.com', 'Test Subject Line', 'This is the message body'))
//     } catch (err) {
//         console.error(err)
//     }
// }
// main()