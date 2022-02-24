import ChatBot from 'react-simple-chatbot';
import Price from './TokenPrice';
import Token from './TopToken';
import { Link } from 'react-router-dom'
import makeBlockie from 'ethereum-blockies-base64';
import { ThemeProvider } from 'styled-components';


function ChtBot() {
  const publicAddress = window.localStorage.getItem('publicAddress')

  const theme = {
    background: '#f5f8fb',
    headerBgColor: '#4F46E5',
    headerFontColor: '#fff',
    headerFontSize: '15px',
    botBubbleColor: '#4F46E5',
    botFontColor: '#fff',
    userBubbleColor: '#fff',
    userFontColor: '#4a4a4a',
  };

  return (
    <ThemeProvider theme={theme}>

      <ChatBot
        floating={true}
        userAvatar={makeBlockie(publicAddress)}
        headerTitle='Plutus Chat'
        steps={[
          {
            id: '1',
            message: 'What is your name?',
            trigger: '2',
          },
          {
            id: '2',
            user: true,
            trigger: '3',
          },
          {
            id: '3',
            message: 'Hi {previousValue}, nice to meet you!, What do you want me to do ?',
            trigger: '4',
          },
          {
            id: '4',
            options: [
              { value: 1, label: 'Crypto', trigger: '6' },
              { value: 2, label: 'Functionality', trigger: '14' },
              { value: 3, label: 'Support help', trigger: '22' },
              { value: 4, label: 'About our product', trigger: '5' },
              { value: 5, label: 'Exit', trigger: '21' },
            ],
          },
          {
            id: '21',
            message: 'THANK YOU FOR VISITING US :) !',
            end: true,
          },
          {
            id: '22',
            options: [
              { value: 1, label: 'What is CeFi ? ', trigger: '23' },
              { value: 2, label: 'Which CeFi vendors do you support?', trigger: '24' },
              { value: 3, label: 'How can I switch wallets?', trigger: '25' },
              { value: 4, label: 'How to share my Fund details?', trigger: '26' },
              { value: 5, label: 'Did not receive bought tokens?', trigger: '27' },
              { value: 6, label: 'Cannot See Tokens?', trigger: '27' },
              { value: 7, label: 'Which tokens are supported?', trigger: '33' },
              { value: 8, label: 'Which assests are supported?', trigger: '34' },
              { value: 9, label: 'Which wallets are supported?', trigger: '35' },
              { value: 10, label: 'Failed to buy token from visa/mastercard?', trigger: '36' },
              { value: 11, label: 'Where can i manage my NFTs from ? ', trigger: '37' }
            ],
          },

          {
            id: '36',
            message: 'ANS TO FAILED TO BUY TOKEN',
            trigerr: '28',
          },
          {
            id: '37',
            message: 'Ans to where can i manage my NFT',
            trigger: '28',
          },
          {
            id: '23',
            message: 'CeFi, short for centralized finance, offers some of the yield benefits of DeFi with some of the ease of use and security of traditional financial-services products. With CeFi, you can earn interest on savings, borrow money, spend with a crypto debit card, and more.',
            trigger: '28',
          },
          {
            id: '24',
            message: 'Cefi vendors- Nexo, Celsius, Binance,Gemini, WazirX.',
            trigger: '28',
          },
          {
            id: '28',
            message: 'Need more help?',
            trigger: '29',
          },
          {
            id: '29',
            options: [
              { value: 1, label: 'YES', trigger: '22' },
              { value: 2, label: 'NO', trigger: '4' },
            ],
          },
          {
            id: '25',
            message: 'You can switch wallets metamask. Click on metamask on top right. Go to accounts and click on the account you want to use.',
            trigger: '28',
          },
          {
            id: '26',
            message: 'You can share your fund details on our platform through email functions.',
            trigger: '28',
          },
          {
            id: '27',
            message: 'Please check you have selected correct address in wallet.',
            trigger: '30',
          },
          {
            id: '30',
            message: 'Did It solve the problem? ',
            trigger: '31',
          },
          {
            id: '31',
            options: [
              { value: 1, label: 'YES', trigger: '28' },
              { value: 2, label: 'NO', trigger: '32' },
            ],
          },
          {
            id: '32',
            message: 'Please write a mail to support@plutus.com with screenshot and missing token name.',
            trigger: '28',
          },
          {
            id: '33',
            message: 'ERC-20 Tokens under ethereum, binance , polygon , avalanche, fantom, arbitrum under blockchain.',
            trigger: '28',
          },
          {
            id: '34',
            message: 'Assests that are in defi wallet such as metamask',
            trigger: '28',
          },
          {
            id: '35',
            message: 'We support metamask wallet for now. New wallets coming soon',
            trigger: '28',
          },

          {
            id: '5',
            message: 'Chains that we support are Ethereum, Binance, Polygon, Avalanche, Fantom, Arbitrum.',
            end: true,
          },
          {
            id: '6',
            options: [
              { value: 1, label: 'TOKEN PRICE', trigger: '7' },
              { value: 2, label: 'TRENDING TOKENS', trigger: '8' },
              { value: 3, label: 'Exchange Rate', trigger: '36' },
            ],
          },


          {
            id: '7',
            message: 'ENTER THE SYMBOL OF TOKEN (EXAMPLE : eth, btc)',
            user: true,
            trigger: '9',
          },
          {
            id: '8',
            component: <Token />,
            trigger: '12',
          },
          {
            id: '9',
            user: true,
            trigger: '36',
          },
          {
            id: '36',
            message: 'In which token do you need the price (for eg : eth, btc, bnb, ltc, usdc)',
            user: true,
            trigger: '10',
          },
          {
            id: '10',
            message: 'Searching .....',
            trigger: '11',
          },
          {
            id: '11',
            component: <Price />,
            asMessage: true,
            trigger: '12',
          },
          {
            id: '12',
            message: 'DO YOU WANT TO CONTINUE ?',
            trigger: '13',
          },
          {
            id: '13',
            options: [
              { value: 1, label: 'YES', trigger: '7' },
              { value: 2, label: 'NO', trigger: '4' },
            ],
          },
          {
            id: '14',
            options: [
              { value: 1, label: 'SWAPPING', trigger: '15' },
              { value: 2, label: 'TRANSFER', trigger: '16' },
            ],
          },
          {
            id: '15',
            message: 'swapping refers to exchanging one coin or token for another.',
            trigger: '17',
          },
          {
            id: '16',
            message: 'Transfer is the movement of a crypto to an external wallet or another exchange via blockchain transaction',
            trigger: '18',
          },
          {
            id: '17',
            message: 'Do you want to swap tokens',
            trigger: '19',
          },
          {
            id: '18',
            message: 'Do you want to transfer tokens',
            trigger: '20',
          },
          {
            id: '19',
            options: [
              { value: 1, label: 'YES', trigger: '6' },
              <Link exact to='./swap'>Go to Swapping Page</Link>,
              { value: 2, label: 'NO', trigger: '4' },
            ],
          },
          {
            id: '20',
            options: [
              { value: 1, label: 'YES', trigerr: '6' },
              <Link exact to='./swap'>Go to Swapping Page</Link>,
              { value: 2, label: 'NO', trigger: '4' },
            ],
          },
        ]}
      />
    </ThemeProvider>


  );
}

export default ChtBot;
