// @flow
import * as React from 'react';

type Props = {|
  className?: string,
  projectName: string,
  projectId: string | number,
  defaultChecked?: boolean,
|};

export default function VolunteerActivityReportingCardIntro({
  className = '',
  projectName,
  projectId,
  defaultChecked = false,
}: Props): React.Node {
  const inputName = `project_${projectId}_log_activity`;

  return (
    <div className={(className || '') + ' var-card-intro'}>
      <label className="var-card-intro__label">
        <span className="var-card-intro__title">{projectName}</span>
        <input
          type="checkbox"
          name={inputName}
          defaultChecked={defaultChecked}
          className="var-card-intro__toggle"
        />
      </label>
      {!defaultChecked && (
        <div className="var-card-intro__hint">No activity to log</div>
      )}
    </div>
  );
}
