const selfsigned = require('selfsigned');
const fs = require('fs');
const path = require('path');
/**
 *
 * @type {Argv.CommandModule} command
 */
const command = {
  command: 'create <cn> [altNames..]',
  describe: 'Creates a self-signed',
  builder: {
    cn: {
      string: true,
      describe: 'A common name'
    },
    altNames: {
      array: true,
      type: 'array'
    },
    outDir: {
      string: true,
      type: 'string',
      alias: 'o',
      describe: 'Provides an output directory',
      default: '.ssl'
    }
  },
  async handler({$0, _, cn, altNames, outDir}) {
    /**
     * @type {CertificateField[]}
     */
    const attributes = [{name: 'commonName', value: cn}];
    /**
     * @type {{
     *   keySize: number,
     *   days: number,
     *   algorithm: string,
     *   extensions: [{ name: string, cA: boolean }],
     *   pkcs7: boolean,
     *   clientCertificate: boolean,
     *   clientCertificateCN: string
     *  }} options
     */
    const options = {
      algorithm: 'sha256',
      days: 365,
      keySize: 2048,
      extensions: [
        {
          name: 'basicConstraints',
          cA: true
        },
        {
          name: 'keyUsage',
          keyCertSign: true,
          digitalSignature: true,
          nonRepudiation: true,
          keyEncipherment: true,
          dataEncipherment: true
        },
        {
          name: 'extKeyUsage',
          serverAuth: true,
          clientAuth: true,
          codeSigning: true,
          timeStamping: true
        },
        {
          name: 'subjectAltName',
          altNames: altNames.map(value => ({type: 2, value}))
        }
      ]
    };
    const pems = selfsigned.generate(attributes, options);
    const dir = path.resolve(process.cwd(), outDir);
    const certLocation = path.resolve(dir, cn);
    await fs.promises.mkdir(dir, {recursive: true});

    await writeFile(`${certLocation}.crt`, pems.cert);
    await writeFile(`${certLocation}.key`, pems.private);
    await writeFile(`${certLocation}.pub`, pems.public);
    await writeFile(`${certLocation}.hash`, pems.fingerprint);
  }
};

const writeFile = (file, data) => fs.promises.writeFile(file, data, {encoding: 'utf8'});

module.exports = command;
