import React from 'react';
import PropTypes from 'prop-types';
import BackboneView from 'components/shared/BackboneView';
import SelectView from 'views/helpers/dropdown';

/**
 * @usage
 * <Select>
 *   <option value="first">First label</option>
 *   <option value="select" selected>Selected label</option>
 * </Select>
 */
export default class Select extends React.Component {
  static propTypes = {
    children: PropTypes.any,
    name: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
    selectedLabel: PropTypes.string, // override the selected option. used at search > date
    selected: PropTypes.any, // TODO: What is expected here?
  };

  componentWillMount() {
    const { options, selected } = this._getOptions(this.props);

    this._view = new SelectView(options, {
      ...this.props,
      selected,
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.selectedLabel && this.props.selectedLabel !== prevProps.selectedLabel) {
      this._view.setSelectedTitle(this.props.selectedLabel, 'custom-label');
    }

    const { options, selected } = this._getOptions(this.props);

    // Recreate SelectView when amount of children changed
    if (!prevProps.children || prevProps.children.length !== this.props.children.length) {
      this._view.setItems(options);
    }

    if (prevProps.selected !== this.props.selected) {
      this._view.setSelected(selected);
    }

    this._view.render();
  }

  _getOptions(props) {
    const options = {};
    let selected = null;
    React.Children.map(props.children, (option) => {
      options[option.props.value] = option.props.children;
      if (option.props.selected) {
        selected = option.props.value;
      }
    });
    return { options, selected };
  }

  render() {
    return <BackboneView view={this._view} />;
  }
}



// WEBPACK FOOTER //
// ./src/js/app/components/Select.js