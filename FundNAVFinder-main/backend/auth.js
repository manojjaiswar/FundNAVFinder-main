const express = require('express');
const router = express.Router();
const { recoverPersonalSignature } = require('eth-sig-util');
const { bufferToHex } = require('ethereumjs-util');
const User = require('./user.model');
var bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const generator = require('generate-password');
const email = require('./email');
const axios = require('axios')
const Cryptojs = require('crypto-js')
const { parse, stringify, toJSON, fromJSON } = require('flatted');
const crypto = require('crypto')

var jsonParser = bodyParser.json();

router.post('/api/metamask', jsonParser, async (req, res) => {
  const password = generator.generate({
    length: 10,
    numbers: true,
    uppercase: false,
  });
  User.findOne({ publicAddress: req.body.publicAddress }).then(function (user) {
    if (!user) {
      const user = new User({
        publicAddress: req.body.publicAddress,
        address: {
          walletAddress: req.body.walletAddress,
          adrName: null,
        },
        password: password
      });
      user
        .save()
        .then((user) => res.json({ nonce: user.nonce, success: true }))
        .catch((err) => console.log(err));
    } else {
      res.json({ nonce: user.nonce, success: true });
      return res;
    }
  });
});

router.post('/api/verifyMetamask', jsonParser, async function (req, res, next) {
  if (
    req.body.signature === '' ||
    req.body.signature === null ||
    req.body.publicAddress === '' ||
    req.body.publicAddress === null
  ) {
    return res.json({ errorMessage: 'Message is empty', success: false });
  } else {
    const user = await User.findOne({ publicAddress: req.body.publicAddress });
    if (!user) {
      throw new Error('User is not defined in "Verify digital signature".');
    }
    var msg = 'I am signing my one-time nonce: ' + user.nonce;
    var msgBufferHex = bufferToHex(Buffer.from(msg, 'utf8'));
    const address = recoverPersonalSignature({
      data: msgBufferHex,
      sig: req.body.signature,
    });
    if (address.toLowerCase() === req.body.publicAddress.toLowerCase()) {
      var token = jwt.sign(user.toJSON(), 'secret', {
        expiresIn: '30d',
      });
      user.nonce = Math.floor(Math.random() * 10000);
      user.save((err) => {
        if (err) {
          return res.json({ success: false, message: 'Error saving nonce' });
        }
        return res.json({ success: true, token: JSON.stringify(token) });
      });
    } else {
      return res.status(401).send({
        error: 'Signature verification failed',
      });
    }
  }
});

router.post('/api/addWallet', jsonParser, async function (req, res) {
  User.findOne({ publicAddress: req.body.publicAddress, 'address.walletAddress': req.body.walletAddress }).then(
    (user) => {
      if (!user) {
        User.findOneAndUpdate(
          { publicAddress: req.body.publicAddress },
          {
            $push: {
              address: {
                walletAddress: req.body.walletAddress,
                adrName: req.body.adrName,
              },
            },
          }
        ).then(() => {
          return res.json({ success: true });
        })
          .catch(() => {
            return res.json({ success: false });
          });
      }
      else {
        return res.json({ message: 'Wallet address already exists' });
      }
    }
  );
});

router.get('/api/getDetails/:publicAddress', jsonParser, async function (req, res) {
  User.findOne({ publicAddress: req.params.publicAddress }).then((data) => {
    res.json({
      message: 'OK',
      results: data,
    });
  });
});

router.post('/api/delAddress', jsonParser, async function (req, res) {
  User.findOneAndUpdate(
    { publicAddress: req.body.publicAddress },
    {
      $pull: {
        address: {
          walletAddress: req.body.walletAddress,
          adrName: req.body.adrName,
        },
      },
    }
  ).then(() => {
    return res.json({ success: true });
  })
    .catch(() => {
      return res.json({ success: false });
    });
});

router.post('/api/editAddress', jsonParser, async function (req, res) {

  User.findOne({ publicAddress: req.body.publicAddress }).then(function (user) {
    if (user) {
      User.findOneAndUpdate(
        { 'address.walletAddress': req.body.walletAddress, publicAddress: req.body.publicAddress },
        { $set: { 'address.$.adrName': req.body.adrName } }
      ).then(() => {
        return res.json({ success: true });

      })
        .catch(() => {
          return res.json({ success: false });
        });
    }
  })
});

router.post('/api/addManagerEmail', jsonParser, async function (req, res) {

  User.findOne({ managerEmail: req.body.managerEmail }).then((user) => {
    if (!user) {
      User.findOneAndUpdate(
        { publicAddress: req.body.publicAddress },
        { managerEmail: req.body.managerEmail }
      )
        .then(() => {
          return res.json({ success: true });
        })
        .catch(() => {
          return res.json({ success: false });
        });
    }
    else {
      return res.json({ message: 'Email already exists' });
    }
  })

});

router.post('/api/addEmail', jsonParser, async function (req, res) {
  User.findOne({ publicAddress: req.body.publicAddress, 'guestUser.email': req.body.email }).then((user) => {
    if (!user) {
      User.findOneAndUpdate(
        { publicAddress: req.body.publicAddress },
        {
          $push: {
            guestUser: {
              email: req.body.email,
              userName: req.body.userName,
            },
          },
        }
      ).then((a) => {
        email
          .verifyEmail(req.body.email, a.password, req.body.userName)
          .then((r) => {
            if (r.success) {
              console.log('verify email', r);
              return res.json({
                success: true,
                msg: 'Email sent successfully',
              });
            } else {
              return res.json({
                success: false,
                msg: 'Email could not be sent',
              });
            }
          })
          .catch((err) => {
            if (err) {
              return res.json({
                success: false,
                msg: 'Email could not be sent',
              });
            }
          });
      });
    } else {
      return res.json({ message: 'Email already exists' });
    }
  });
});

router.post('/api/delEmail', jsonParser, async function (req, res) {
  User.findOneAndUpdate(
    { publicAddress: req.body.publicAddress },
    {
      $pull: {
        guestUser: {
          email: req.body.email,
        },
      },
    }
  ).then(() => {
    return res.json({ success: true });
  })
    .catch(() => {
      return res.json({ success: false });
    });
});


router.post('/api/saveData', jsonParser, async (req, res) => {
  const { data, nav, selectedChain, selectedAddress } = req.body
  User.findOneAndUpdate(
    { publicAddress: req.body.publicAddress },
    {
      $push: {
        history: {
          data: data,
          date: Date.now(),
          nav: nav,
          selectedAddress: selectedAddress,
          selectedChain: selectedChain,
        },
      },
    }
  ).then(() => {
    return res.json({ success: true });
  })
    .catch((err) => {
      console.log(err, 'error')
      return res.json({ success: false });
    });
});

router.post('/api/deleteColumn', jsonParser, async (req, res) => {
  User.findOneAndUpdate(
    { publicAddress: req.body.publicAddress },
    {
      $pull: {
        history: {
          _id: req.body.id,
        },
      },
    }
  ).then(() => {
    return res.json({ success: true });
  })
    .catch(() => {
      return res.json({ success: false });
    });
});

router.post('/api/verifyEmail', jsonParser, (req, res) => {
  User.findOne({
    password: req.body.password,
    'guestUser.email': req.body.email,
  }).then((user) => {
    if (user) {
      return res.json({ success: true, user: user });
    } else {
      return res.json({ success: false, message: 'Invalid email id or access token' });
    }
  }).then(() => {
    return res.json({ success: true });
  })
    .catch(() => {
      return res.json({ success: false });
    });
});

router.post('/api/resendEmail', jsonParser, (req, res) => {
  User.findOne({ 'guestUser.email': req.body.email }).then((a) => {
    email
      .verifyEmail(req.body.email, a.password, a.guestUser[0].userName)
      .then((r) => {
        if (r.success) {
          console.log('verify email', r);
          return res.json({ success: true, msg: 'Email sent successfully' });
        } else {
          return res.json({ success: false, msg: 'Email could not be sent' });
        }
      })
      .catch((err) => {
        if (err) {
          return res.json({ success: false, msg: 'Email could not be sent' });
        }
      });
  });
});

router.post('/api/verifyWallet', jsonParser, async (req, res, next) => {
  if (req.body.publicAddress === '' || req.body.publicAddress === null) {
    return res.json({ errorMessage: "Message is empty", success: false })
  }
  else {
    const user = await User.findOne({ publicAddress: req.body.publicAddress })
    if (!user) {
      throw new Error('User is not found');
    }
    var token = jwt.sign(user.toJSON(), 'secret', {
      expiresIn: '30d',
    })
    return res.json({ success: true, token: JSON.stringify(token) })
  }
})

router.post('/api/getBinance', jsonParser, async (req, res, next) => {
  const apiKey = req.body.apiKey
  const url = req.body.url
  const data = await axios.get(url, {
    mode: 'no-cors',
    headers: {
      // 'Access-Control-Allow-Headers':'Access-Control-Allow-Origin',
      'Access-Control-Allow-Headers': 'X-MBX-APIKEY',
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      // "Access-Control-Allow-Credentials": "true",
      'X-MBX-APIKEY': apiKey
    },
    credentials: 'same-origin',
  })
  return res.json({ data: (data.data.balances) })
})

router.post('/api/cefiHistory', jsonParser, async (req, res) => {
  const { date, data, nav, cefi } = req.body;
  console.log('step1');
  User.findOne( { publicAddress: req.body.publicAddress,"cefiHistory.cefi": cefi },).then((user) => {
    console.log('step2');
    if (user === null) {
      console.log('step3');
      User.findOneAndUpdate(
        { publicAddress: req.body.publicAddress },
        {$push: {cefiHistory: {date: Date.now(), data: data, nav: nav, cefi: cefi}}}
      ).then((user) => {console.log(user, 'user');})
        .catch((error) => {console.log('catch');console.log(error);})
    } else {
      console.log('step4');
      User.findByIdAndUpdate(
        { publicAddress: req.body.publicAddress, "cefiHistory.cefi": cefi },
        {$set: {cefiHistory: {date: Date.now(), data: data, nav: nav, cefi: cefi}}}
      )
    }
  }).then(()=>console.log('success'))
    .catch((err) => {console.log('step5');console.log(err, 'error')});
});


router.post('/api/getNexo', jsonParser, async (req, res)=>{
  const secretKey = req.body.secretKey
  const apiKey = req.body.apiKey
  const hash = crypto.createHmac("SHA256",secretKey).update(String(Date.now())).digest('base64')
  
  console.log(`nonce: ${nonce} || secretKey:${secretKey} || hashDigest ${hashDigest} || signature : ${hash}`)
  try{
    const nexoAPI = await axios.get("https://prime-api.prime-nexo.net/api/v1/accountSummary", {
      mode: 'no-cors',
      headers: {
          'Access-Control-Allow-Headers': 'Access-Control-Allow-Origin,X-API-KEY,X-NONCE,X-SIGNATURE',
          'Access-Control-Allow-Origin': 'https://polysets.local/',
          'Content-Type': 'application/json',
          "X-API-KEY": apiKey,
          "X-NONCE": nonce,
          "X-SIGNATURE": hash
        }
      })
      console.log(nexoAPI.data.balances, 'aa')
      return res.json({msg:nexoAPI.data.balances})
    } catch(err){
      console.log(err)
      return res.json({msg:err})
  }
})

module.exports = router;
