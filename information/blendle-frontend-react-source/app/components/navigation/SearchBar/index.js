import React, { Component } from 'react';
import { bool, func } from 'prop-types';
import { history } from 'byebye';
import { translate } from 'instances/i18n';
import { SearchIcon, CloseIcon } from '@blendle/lego';
import classNames from 'classnames';
import CSS from './style.scss';

export default class SearchBar extends Component {
  static propTypes = {
    isOpen: bool.isRequired,
    onToggleSearch: func.isRequired,
  };

  state = {
    query: '',
  };

  componentDidUpdate(prevProps) {
    if (this.inputEl && !prevProps.isOpen && this.props.isOpen) {
      this.inputEl.focus();
    }
  }

  onSubmit = (e) => {
    e.preventDefault();

    if (this.inputEl) {
      this.inputEl.blur();
    }

    this.props.onToggleSearch();
    history.navigate(`/search/${encodeURIComponent(this.state.query)}`, { trigger: true });
  };

  onChangeQuery = (e) => {
    this.setState({
      query: e.target.value,
    });
  };

  render() {
    const { isOpen, onToggleSearch } = this.props;

    return (
      <div className={CSS.container}>
        <form onSubmit={this.onSubmit} className={classNames(CSS.form, isOpen && CSS.isOpen)}>
          <span
            role="button"
            tabIndex={-1}
            onClick={onToggleSearch}
            data-test-identifier="navigation-bar-search-button"
          >
            <SearchIcon className={CSS.icon} />
          </span>
          <input
            type="text"
            ref={inputEl => (this.inputEl = inputEl)}
            name="q"
            onChange={this.onChangeQuery}
            placeholder={translate('search.text.placeholder')}
            className={CSS.input}
            disabled={!isOpen}
          />
          <button
            type="button"
            onClick={onToggleSearch}
            className={CSS.buttonClose}
            disabled={!isOpen}
          >
            <CloseIcon />
          </button>
        </form>
        {isOpen && <button onClick={onToggleSearch} className={CSS.mobileOverlay} />}
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/components/navigation/SearchBar/index.js