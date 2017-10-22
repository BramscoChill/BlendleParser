import { STATUS_INITIAL, STATUS_PENDING, STATUS_OK, STATUS_ERROR } from 'app-constants';
import alt from 'instances/altInstance';
import KioskActions from 'actions/KioskActions';
import IssueActions from 'actions/IssueActions';
import { merge } from 'lodash';

class IssuesStore {
  constructor() {
    this.bindActions(KioskActions);
    this.bindActions(IssueActions);

    this.state = {
      status: STATUS_INITIAL,
      latestIssues: {},
      issues: {},
      categoryId: '',
      scrollPosition: 0,
      message: null,
      visible: true,
    };
  }

  onChangeVisibility(visible) {
    this.setState({ visible });
  }

  onFetchLatestIssueSuccess(newLatestIssues) {
    // Merge the states, because the actions could be called in parallel
    this.setState({
      latestIssues: merge(this.state.latestIssues, newLatestIssues),
    });
  }

  onFetchIssueSuccess(newIssues) {
    this.setState({
      issues: merge(this.state.issues, newIssues),
    });
  }

  onFetchCategory({ categoryId }) {
    let issues = this.state.issues;
    if (this.state.categoryId !== categoryId) {
      issues = null;
    }

    this.setState({
      status: STATUS_PENDING,
      scrollPosition: 0,
      issues,
      categoryId,
    });
  }

  onFetchAcquiredIssues() {
    this.onFetchCategory({ categoryId: 'my-issues' });
  }

  onFetchNextAcquiredIssues() {
    this.onFetchCategory({ categoryId: 'my-issues' });
  }

  onFetchCategorySuccess({ categoryId, issues }) {
    if (this.state.categoryId === categoryId) {
      this.setState({
        status: STATUS_OK,
        scrollPosition: 0,
        issues,
      });
    }
  }

  onFetchAcquiredIssuesSuccess({ issues }) {
    this.onFetchCategorySuccess({ categoryId: 'my-issues', issues });
  }

  onFetchNextAcquiredIssuesSuccess({ issues }) {
    this.setState({
      status: STATUS_OK,
      issues,
    });
  }

  onFetchCategoryError({ categoryId, message }) {
    if (this.state.categoryId === categoryId) {
      this.setState({
        status: STATUS_ERROR,
        scrollPosition: 0,
        categoryId: null,
        issues: null,
        message,
      });
    }
  }

  onFetchAcquiredIssuesError({ message }) {
    this.onFetchCategoryError({ message });
  }

  onRememberScrollPosition({ position }) {
    this.setState({
      scrollPosition: position,
    });
  }
}

export default alt.createStore(IssuesStore, 'IssuesStore');



// WEBPACK FOOTER //
// ./src/js/app/stores/IssuesStore.js