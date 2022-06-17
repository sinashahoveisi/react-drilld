import {FC, useCallback, useEffect, useMemo, useState} from 'react';
import clsx from 'clsx';
import {
  flatMapDeep,
  get,
  isFunction,
  set,
  map,
  concat,
  dropRight,
  last,
  merge,
  isUndefined,
  forEach,
  entries,
  isNil,
  cloneWith
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

export type checkIsFolder = (folder: any) => boolean;

export interface DrillDProps {
  title?: string;
  folders?: FolderProps[];
  showFullPath?: boolean;
  folderClassName?: string;
  containerClassName?: string;
  backTitle?: string;
  url?: string;
  headerRequest: HeadersInit;
  selectFolderQueryParams?: (folder: any) => object;
  fetchedChildrenDataPath?: onAfterGetChildren | string[] | string;
  isFolderProps?: checkIsFolder | string[] | string;
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
  selectFolderQueryParams = (folder: any) => folder?.id,
  fetchedChildrenDataPath = 'data',
  isFolderProps = 'isFolder'
}) => {
  const [depth, setDepth] = useState<FolderDepthProps[]>([]);
  const [fetchedFolders, setFetchedFolders] = useState<FolderProps[]>([]);

  const pushToDepth = useCallback((item: FolderProps, index: number) => {
    setDepth((prevState) => concat(prevState, merge(item, {index})));
  }, []);

  const popDepth = useCallback(() => {
    setDepth((prevState) => dropRight(prevState));
  }, []);

  const foldersChildren = useMemo(() => {
    const path = flatMapDeep(depth, (depthItem: FolderDepthProps) => [depthItem.index, 'children']);
    if (path?.length) return get(url ? fetchedFolders : folders, path);
    return url ? fetchedFolders : folders;
  }, [depth, fetchedFolders]);

  useEffect(() => {
    if (url && selectFolderQueryParams && !foldersChildren) {
      const fetchUrl = new URL(url);
      const queryFolder = selectFolderQueryParams(last(depth));
      forEach(entries(queryFolder), ([key, value]: [string, any]) => {
        if (!isNil(value)) fetchUrl.searchParams.append(key, value);
      });
      fetch(fetchUrl, {
        headers: headerRequest
      })
        .then((response) => response.json())
        .then((children: any) => {
          const childrenFolder = isFunction(fetchedChildrenDataPath)
            ? fetchedChildrenDataPath(children)
            : get(children, fetchedChildrenDataPath);
          const path = flatMapDeep(depth, (depthItem: FolderDepthProps) => [depthItem.index, 'children']);
          const newFetchedFolders = cloneWith([...(fetchedFolders || [])], (copyFetchedFolders: FolderProps[]) => {
            if (path?.length) {
              set(copyFetchedFolders, path, childrenFolder);
              return copyFetchedFolders;
            }
            return childrenFolder;
          });
          setFetchedFolders(newFetchedFolders);
        })
        .catch(console.error);
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
              {map(depth, (folder: FolderProps, index: number) => (
                <li key={index}>
                  <span>{folder?.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="body">
        {isUndefined(foldersChildren) && url ? (
          <Spinner />
        ) : (
          map(foldersChildren, (folder: FolderProps, index: number) => {
            const isFolder = isFunction(isFolderProps)
              ? isFolderProps(folder)
              : get(folder, isFolderProps) || folder?.children;
            return (
              <button
                type="button"
                key={index}
                className={clsx('folder-container', folderClassName)}
                onClick={() => pushToDepth(folder, index)}>
                <div className="folder-name">
                  {isFolder ? <Folder /> : <Document />}
                  <span>{folder?.name}</span>
                </div>
                {isFolder && <Forward />}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default DrillD;
