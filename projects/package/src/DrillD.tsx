import React, {FC, useCallback, useState} from 'react';
import clsx from 'clsx';
import map from 'lodash/map';
import concat from 'lodash/concat';
import dropRight from 'lodash/dropRight';
import last from 'lodash/last';
import {Back, Folder, Document, Forward} from 'svg';
import type {DrillDProps, FolderProps} from 'types'
import 'styles/main.scss';


const DrillD: FC<DrillDProps> = ({
     title,
     folders,
     folderClassName,
     containerClassName,
     showFullPath ,
    backTitle= 'back'
}) => {

    const [depth, setDepth] = useState<FolderProps[]>([]);

    const pushToDepth = useCallback((item: FolderProps) => {setDepth(prevState => concat(prevState, item));}, []);

    const popDepth = useCallback(() => {setDepth(prevState => dropRight(prevState));}, []);

    return (
        <div className={clsx('container', containerClassName)}>
            <div className="header">
                <h4>{title}</h4>
                <button className="back-button" onClick={popDepth}>
                    <Back />
                    <span>{showFullPath ? backTitle : last(depth)?.name}</span>
                </button>
                {showFullPath && (
                    <ul className="full-path-container">{map(depth, (folder: FolderProps) => <li>{folder?.name}</li>)}</ul>
                )}
            </div>
            {map(folders, (folder: FolderProps) => (
                <button type="button" className={clsx('folder-item', folderClassName)} onClick={() => pushToDepth(folder)}>
                    <div className="folder-name">
                        {folder?.children || folder?.isFolder ? <Folder /> : <Document />}
                        <span>{folder?.name}</span>
                    </div>
                    {folder?.children || folder?.isFolder && <Forward />}
                </button>
            ))}
        </div>
    )
}

export default DrillD;
