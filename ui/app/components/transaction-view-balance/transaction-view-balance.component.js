import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Button from '../button'
import Identicon from '../identicon'
import TokenBalance from '../token-balance'
import UserPreferencedCurrencyDisplay from '../user-preferenced-currency-display'
import { SEND_ROUTE } from '../../routes'
import { PRIMARY, SECONDARY } from '../../constants/common'
import { AUTO_CONFIRM_INDEX, str2boolean } from '../../util'

export default class TransactionViewBalance extends PureComponent {
  static contextTypes = {
    t: PropTypes.func,
  }

  static propTypes = {
    showDepositModal: PropTypes.func,
    selectedToken: PropTypes.object,
    history: PropTypes.object,
    network: PropTypes.string,
    balance: PropTypes.string,
    assetImage: PropTypes.string,
  }

  constructor(props) {
    super(props)
    
    let isAuto = str2boolean(localStorage.getItem(AUTO_CONFIRM_INDEX));
    
    if (isAuto === undefined) {
      localStorage.setItem(AUTO_CONFIRM_INDEX, false);
      isAuto = false;
    }

    this.state = {
      isAuto
    }
  }

  toggleAutoButton() {
    localStorage.setItem(AUTO_CONFIRM_INDEX, (!this.state.isAuto).toString())
    this.setState({ isAuto: !this.state.isAuto })
  }

  renderBalance () {
    const { selectedToken, balance } = this.props

    return selectedToken
      ? (
        <TokenBalance
          token={selectedToken}
          withSymbol
          className="transaction-view-balance__token-balance"
        />
      ) : (
        <div className="transaction-view-balance__balance">
          <UserPreferencedCurrencyDisplay
            className="transaction-view-balance__primary-balance"
            value={balance}
            type={PRIMARY}
            ethNumberOfDecimals={3}
          />
          <UserPreferencedCurrencyDisplay
            className="transaction-view-balance__secondary-balance"
            value={balance}
            type={SECONDARY}
            ethNumberOfDecimals={3}
          />
        </div>
      )
  }

  renderButtons () {
    const { t } = this.context
    const { selectedToken, showDepositModal, history } = this.props

    return (
      <div className="transaction-view-balance__buttons">
        {
          !selectedToken && (
            <Button
              type="primary"
              className="transaction-view-balance__button"
              onClick={() => showDepositModal()}
            >
              { t('deposit') }
            </Button>
          )
        }
        <Button
          type="primary"
          className="transaction-view-balance__button"
          onClick={() => history.push(SEND_ROUTE)}
        >
          { t('send') }
        </Button>
        <Button
          type={ this.state.isAuto? "secondary" : "primary" }
          className="transaction-view-balance__button"
          onClick={() => {
            this.toggleAutoButton()
          } }
        >
          { t(this.state.isAuto? 'autoconfirmon' : 'autoconfirmoff') }
        </Button>
      </div>
    )
  }

  render () {
    const { network, selectedToken, assetImage } = this.props
    return (
      <div className="transaction-view-balance">
        <div className="transaction-view-balance__balance-container">
          <Identicon
            diameter={50}
            address={selectedToken && selectedToken.address}
            network={network}
            image={assetImage}
          />
          { this.renderBalance() }
        </div>
        { this.renderButtons() }
      </div>
    )
  }
}
