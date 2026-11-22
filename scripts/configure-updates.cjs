'use strict';
const fs=require('node:fs');const path=require('node:path');const root=path.join(__dirname,'..');
const [owner,repo,publisherName]=process.argv.slice(2);
if(!/^[A-Za-z0-9][A-Za-z0-9-]{0,38}$/.test(owner||'')||!/^[A-Za-z0-9_.-]{1,100}$/.test(repo||'')||!publisherName||/[\r\n]/.test(publisherName)){console.error('Usage: node scripts/configure-updates.cjs OWNER REPO "Certificate publisher name"');process.exit(1);}
const pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));pkg.build.publish=[{provider:'github',owner,repo,releaseType:'release'}];pkg.build.forceCodeSigning=true;pkg.build.win.signtoolOptions={...(pkg.build.win.signtoolOptions||{}),publisherName};pkg.build.win.verifyUpdateCodeSignature=true;
fs.writeFileSync(path.join(root,'package.json'),JSON.stringify(pkg,null,2)+'\n');fs.writeFileSync(path.join(root,'src/update-config.json'),JSON.stringify({configured:true,provider:'github',owner,repo,publisherName},null,2)+'\n');console.log('Official release source configured. Signed Windows builds are now required.');
