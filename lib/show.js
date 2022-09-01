const fs = require('fs');
const path = require('path');
const {X509Certificate,createPrivateKey} = require('crypto');
/**
 *
 * @type {Argv.CommandModule} command
 */
const command = {
  command: 'show <filename>',
  describe: 'Shows info about certificate',
  builder: {
    filename: {
      string: true
    }
  },
  async handler({$0, _, filename}) {
    const fileLocation = path.resolve(filename);
    const x509 = new X509Certificate(fs.readFileSync(fileLocation));
    console.info(x509);
  }
};
module.exports = command;
