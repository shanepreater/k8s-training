const express = require('express')
const winston = require('winston')
const { networkInterfaces } = require('os');

const logger = winston.createLogger({
  level: 'debug',
  transports: [new winston.transports.Console()]
})

let deathLoop = false;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;

const getNetworkDetails = () => {
  const nets = networkInterfaces();
  let results = "<thead><tr><th>Name</th><th>Ip address</th><th>Protocol</th></tr></thead>"

  for (const name of Object.keys(nets)) {
    logger.info(`Checking network details for ${name}`)
    if(name.startsWith('lo') || name.startsWith('en'))
    for (const net of nets[name]) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      logger.info(`  ${name} = ${net.family}`)
      if (net.family === 'IPv4' && !net.internal) {

        results += `<tr><td>${name}</td><td>${net.address}</td><td>${net.family}</td></tr>`
      }
    }
  }
  return '<table>' + results + '</table>'
}

app.get('/', (req, res) => {
  const network = getNetworkDetails()
  res.send(`<html>
<head>
    <title>Echo Test serve</title>
</head>
<body>
    <h1>Welcome trainees</h1>
    <p>This is the test server for initial testing</p>
    <h2>Network details</h2>
    ${network}
</body>
</html>`);
});

app.get('/health', (req, res) => {
  let content = 'All good in the hood'
  if(deathLoop) {
    res.status(501)
    content ='Everybody\'s dead dave!'
  } else {
    const content ='All good in the hood'
  }
  res.send(`
<html>
    <head>
        <title>Burning the instance</title>
    </head>
    <body>
        <h1>Health check details</h1>
        <p>${content}</p>
    </body>
</html>
  `)
})

app.get('/die', (req, res) => {
  deathLoop = true
  res.send(`
<html>
    <head>
        <title>Burning the instance</title>
    </head>
    <body>
        <h1>Setting the instance to die next time.</h1>
        <p>Marking this instance as dead for future health checks</p>
    </body>
</html>
  `)
})

app.listen(port, () => console.log(`Ready on port ${port}`));
