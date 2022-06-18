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
  cloneWith,
  some,
  remove
} from 'lodash';
import {CheckBox} from 'components';
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
  mode?: 'single' | 'multiple';
  isSelectableFolder?: boolean;
  headerRequest?: HeadersInit;
  selectFolderQueryParams?: (folder: any) => object;
  fetchedChildrenDataPath?: onAfterGetChildren | string[] | string;
  labelKey?: string[] | string;
  valueKey?: string[] | string;
  folderKey?: checkIsFolder | string[] | string;
  defaultValue?: FolderProps[];
  checkIsSelected?: (folder: any) => boolean;
}

const DrillD: FC<DrillDProps> = ({
  title,
  folders,
  folderClassName,
  containerClassName,
  showFullPath,
  backTitle = 'back',
  defaultValue,
  checkIsSelected,
  valueKey = 'id',
  labelKey = 'name',
  mode = 'single',
  isSelectableFolder,
  url,
  headerRequest,
  selectFolderQueryParams = (folder: any) => folder?.id,
  fetchedChildrenDataPath = 'data',
  folderKey = 'isFolder'
}) => {
  const [depth, setDepth] = useState<FolderDepthProps[]>([]);
  const [fetchedFolders, setFetchedFolders] = useState<FolderProps[]>([]);
  const [selectFolders, setSelectFolders] = useState<FolderProps[]>(defaultValue || []);

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

  const onSelectFolder = (folder: FolderProps, checked: boolean) => {
    if (checked) setSelectFolders((prevState) => (mode === 'multiple' ? [...prevState, folder] : [folder]));
    else {
      const newSelectedItem = cloneWith(selectFolders, (copySelectFolder: FolderProps[]) => {
        remove(copySelectFolder, (copyFolder: FolderProps) => get(copyFolder, valueKey) === get(folder, valueKey));
        return copySelectFolder;
      });
      setSelectFolders(newSelectedItem);
    }
  };

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
            const isFolder = isFunction(folderKey) ? folderKey(folder) : get(folder, folderKey) || folder?.children;
            return (
              <div key={index} className={clsx('folder-container', folderClassName)}>
                <div className="folder-name">
                  {((!isFolder && mode === 'multiple') || (isFolder && isSelectableFolder)) && (
                    <CheckBox
                      defaultChecked={
                        isFunction(checkIsSelected)
                          ? checkIsSelected(folder)
                          : some(selectFolders, [valueKey, get(folder, valueKey)])
                      }
                      name={get(folder, labelKey)}
                      onChange={(checked: boolean) => {
                        onSelectFolder(folder, checked);
                      }}
                    />
                  )}
                  {isFolder ? <Folder /> : <Document />}
                  <span>{get(folder, labelKey)}</span>
                </div>
                {isFolder && (
                  <button type="button" onClick={() => pushToDepth(folder, index)}>
                    <Forward />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default DrillD;
