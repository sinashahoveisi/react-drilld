import {FC, useCallback, useEffect, useMemo, useState} from 'react';
import clsx from 'clsx';
import axios, {AxiosRequestHeaders, AxiosResponse} from 'axios';
import {
  cloneDeepWith,
  flatMapDeep,
  get,
  isFunction,
  set,
  map,
  concat,
  dropRight,
  last,
  merge,
  isUndefined
} from 'lodash';
import {Back, Folder, Document, Forward, Spinner} from 'svg';
import './styles/main.scss';

export interface FolderProps {
  name: string;
  isFolder?: boolean;
  children?: FolderProps[];
}

export interface FolderDepthProps {
  name: string;
  index: number;
}

export type onAfterGetChildren = (fetchedFoldersData: any) => Array<FolderProps>;

export interface DrillDProps {
  title?: string;
  folders: FolderProps[];
  showFullPath?: boolean;
  folderClassName?: string;
  containerClassName?: string;
  backTitle?: string;
  url?: string;
  headerRequest: AxiosRequestHeaders;
  selectFolderQueryParams?: (folder: any) => object;
  fetchedChildrenDataPath?: onAfterGetChildren | string[] | string;
}

const DrillD: FC<DrillDProps> = ({
  title,
  folders,
  folderClassName,
  containerClassName,
  showFullPath,
  backTitle = 'back',
  url,
  headerRequest,
  selectFolderQueryParams,
  fetchedChildrenDataPath
}) => {
  const [depth, setDepth] = useState<FolderDepthProps[]>([]);
  const [fetchedFolders, setFetchedFolders] = useState<FolderProps[]>([]);

  const pushToDepth = useCallback((item: FolderProps, index: number) => {
    setDepth((prevState) => concat(prevState, merge(item, {index})));
  }, []);

  const popDepth = useCallback(() => {
    setDepth((prevState) => dropRight(prevState));
  }, []);

  const foldersChildren = useMemo(
    () =>
      get(
        url ? fetchedFolders : folders,
        flatMapDeep(depth, (depthItem: FolderDepthProps) => [depthItem.index, 'children'])
      ),
    [depth, fetchedFolders]
  );

  useEffect(() => {
    if (url && selectFolderQueryParams) {
      const queryFolder = selectFolderQueryParams(last(depth));
      axios
        .get(url, {
          headers: merge(headerRequest || {}, {params: queryFolder})
        })
        .then((children: AxiosResponse<any>) => {
          const childrenFolder = isFunction(fetchedChildrenDataPath)
            ? fetchedChildrenDataPath(children)
            : get(children, fetchedChildrenDataPath || 'data');
          const newFetchedFolders = cloneDeepWith(fetchedFolders, (copyFetchedFolders: FolderProps[]) => {
            set(
              copyFetchedFolders,
              flatMapDeep(depth, (depthItem: FolderDepthProps) => [depthItem.index, 'children']),
              childrenFolder
            );
            return copyFetchedFolders;
          });
          setFetchedFolders(newFetchedFolders);
        });
    }
  }, [depth]);

  return (
    <div className={clsx('drilld container', containerClassName)}>
      <div className="header">
        <h4>{title}</h4>
        <div className="header-action">
          {!!depth?.length && (
            <button className="back-button" onClick={popDepth}>
              <Back />
              <span>{showFullPath ? backTitle : last(depth)?.name}</span>
            </button>
          )}
          {showFullPath && (
            <ul className="full-path-container">
              {map(depth, (folder: FolderProps) => (
                <li>
                  <span>{folder?.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {isUndefined(foldersChildren) && url ? (
        <Spinner />
      ) : (
        map(foldersChildren, (folder: FolderProps, index: number) => (
          <button
            type="button"
            className={clsx('folder-container', folderClassName)}
            onClick={() => pushToDepth(folder, index)}>
            <div className="folder-name">
              {folder?.children || folder?.isFolder ? <Folder /> : <Document />}
              <span>{folder?.name}</span>
            </div>
            {(folder?.children || folder?.isFolder) && <Forward />}
          </button>
        ))
      )}
    </div>
  );
};

export default DrillD;
