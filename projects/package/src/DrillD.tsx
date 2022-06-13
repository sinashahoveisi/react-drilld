import {FC, useCallback, useState} from 'react';
import clsx from 'clsx';
import map from 'lodash/map';
import concat from 'lodash/concat';
import dropRight from 'lodash/dropRight';
import last from 'lodash/last';
import {Back, Folder, Document, Forward} from 'svg';
import './styles/main.scss';

export interface FolderProps {
  name: string;
  isFolder?: boolean;
  children?: FolderProps[];
}

export interface DrillDProps {
  title?: string;
  folders: FolderProps[];
  showFullPath?: boolean;
  folderClassName?: string;
  containerClassName?: string;
  backTitle?: string;
}

const DrillD: FC<DrillDProps> = ({
  title,
  folders,
  folderClassName,
  containerClassName,
  showFullPath,
  backTitle = 'back'
}) => {
  const [depth, setDepth] = useState<FolderProps[]>([]);

  const pushToDepth = useCallback((item: FolderProps) => {
    setDepth((prevState) => concat(prevState, item));
  }, []);

  const popDepth = useCallback(() => {
    setDepth((prevState) => dropRight(prevState));
  }, []);

  return (
    <div className={clsx('drilld-container', containerClassName)}>
      <div className="drilld-header">
        <h4>{title}</h4>
        <button className="drilld-back-button" onClick={popDepth}>
          <Back />
          <span>{showFullPath ? backTitle : last(depth)?.name}</span>
        </button>
        {showFullPath && (
          <ul className="drilld-full-path-container">
            {map(depth, (folder: FolderProps) => (
              <li>{folder?.name}</li>
            ))}
          </ul>
        )}
      </div>
      {map(last(depth)?.children || folders, (folder: FolderProps) => (
        <button
          type="button"
          className={clsx('drilld-folder-item', folderClassName)}
          onClick={() => pushToDepth(folder)}>
          <div className="drilld-folder-name">
            {folder?.children || folder?.isFolder ? <Folder /> : <Document />}
            <span>{folder?.name}</span>
          </div>
          {(folder?.children || folder?.isFolder) && <Forward />}
        </button>
      ))}
    </div>
  );
};

export default DrillD;
