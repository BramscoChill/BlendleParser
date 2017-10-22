import React from 'react';
import { compose, pure, setDisplayName, setPropTypes, onlyUpdateForPropTypes } from 'recompose';
import PropTypes from 'prop-types';
import ToggleButton from 'components/buttons/Toggle';
import classNames from 'classnames';

import CSS from './style.scss';

function isLoading(id, loadingExperiments) {
  return loadingExperiments.includes(id);
}

function renderExperiments(experiments, loadingExperiments, onToggle) {
  return experiments.map(experiment => (
    <li className="row" key={experiment.key}>
      <ToggleButton
        className={classNames(CSS.toggle, {
          [CSS.loading]: isLoading(experiment.key, loadingExperiments),
        })}
        checked={experiment.enabled}
        onToggle={() => onToggle(experiment, !experiment.enabled)}
      />
      <span dangerouslySetInnerHTML={{ __html: experiment.description }} />
    </li>
  ));
}

const enhance = compose(
  setDisplayName('LabsPage'),
  onlyUpdateForPropTypes,
  setPropTypes({
    experiments: PropTypes.array.isRequired,
    loadingExperiments: PropTypes.array.isRequired,
    onToggle: PropTypes.func.isRequired,
  }),
  pure,
);

const LabPage = enhance(({ onToggle, experiments, loadingExperiments }) => (
  <div className="pane lab">
    <div className="container">
      <h2 className={`header ${CSS.header}`}>Blendle Lab</h2>
      <p className={CSS.paragraph}>Welkom in het Blendle-laboratorium! Hier doen we proefjes.</p>
      <p className={CSS.paragraph}>
        Met de schuifjes hieronder kun je het nieuwste van het nieuwste proberen, nog vóórdat het af
        is.
      </p>
      <p className={CSS.paragraph}>
        In het lab experimenteren we met nieuwe functies en kijken we of ze goed genoeg zijn om voor
        iedereen aan te zetten. Nog niet alles zal vlekkeloos werken, dus laat het ons{' '}
        <a href="mailto:contact@blendle.com?subject=Ik%20wil%20iets%20zeggen%20over%20het%20Blendle-laboratorium">
          weten
        </a>{' '}
        als je gekke dingen ziet.
      </p>
      <section className={CSS.toggles}>
        <ul>{renderExperiments(experiments, loadingExperiments, onToggle)}</ul>
      </section>
    </div>
  </div>
));

export default LabPage;



// WEBPACK FOOTER //
// ./src/js/app/modules/settings/components/LabPage/index.js