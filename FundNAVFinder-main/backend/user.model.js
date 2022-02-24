const mongoose = require('mongoose');

const Schema = mongoose.Schema;
var UserSchema = new Schema(
  {
    publicAddress: {
      type: String,
      unique: true,
      isLowerCase: true,
    },
    managerEmail: {
      type: String,
    },
    password: {
      type: String,
      unique: true,
    },
    nonce: {
      type: Number,
      required: true,
      default: () => Math.floor(Math.random() * 1000000),
    },
    history: [
      {
        data: [
          {
            token: String,
            balance: String,
            price: String,
            value: String,
            block: String,
          },
        ],
        date: Date,
        nav: String,
        selectedAddress: Array,
        selectedChain: Array,
      },
    ],
    address: [
      {
        walletAddress: String,
        adrName: String,
      },
    ],
    guestUser: [
      {
        email: String,
        userName: String,
      },
    ],
    cefiHistory: [
      {
        date: Date,
        data: [
          {
            token: String,
            balance: String,
            price: String,
            value: String,
          },
        ],
        nav: Number,
        cefi: String,
      }
    ]
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);
const User = mongoose.model('User', UserSchema);

module.exports = User;
