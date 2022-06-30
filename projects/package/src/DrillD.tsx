import {ChangeEvent, FC, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import clsx from 'clsx';
import lodash from 'lodash';
import deepdash from 'deepdash';
import {CheckBox} from 'components';
import {Back, Folder, Document, Forward, Spinner} from 'svg';
import './styles/main.scss';

deepdash(lodash);

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

export type urlByDepth = (depth?: FolderDepthProps[]) => string;

export interface DrillDProps {
  title?: string;
  folders?: FolderProps[];
  showFullPath?: boolean;
  folderClassName?: string;
  containerClassName?: string;
  backTitle?: string;
  url?: string | string[] | urlByDepth;
  maxDepth?: number;
  mode?: 'single' | 'multiple';
  isSelectableFolder?: boolean;
  headerRequest?: HeadersInit;
  queryParams?: object;
  selectFolderQueryParams?: (folder: any) => object;
  fetchedChildrenDataPath?: onAfterGetChildren | string[] | string;
  labelKey?: string[] | string;
  valueKey?: string[] | string;
  folderKey?: checkIsFolder | string[] | string | boolean;
  defaultValue?: FolderProps[];
  checkIsSelected?: (folder: any) => boolean;
  onSave?: (selectedFolders: FolderProps[] | FolderProps) => void;
  hasSearch?: boolean;
  searchQueryKey?: string;
}

const DrillD: FC<DrillDProps> = ({
  title,
  folders,
  folderClassName,
  containerClassName,
  showFullPath = false,
  maxDepth = Infinity,
  backTitle = 'back',
  defaultValue,
  queryParams,
  checkIsSelected,
  valueKey = 'id',
  labelKey = 'name',
  mode = 'single',
  isSelectableFolder,
  url,
  onSave,
  hasSearch = false,
  searchQueryKey,
  headerRequest,
  selectFolderQueryParams = (folder: any) => folder?.id,
  fetchedChildrenDataPath = 'data',
  folderKey = 'isFolder'
}) => {
  const search = useRef<string | null>();
  const [depth, setDepth] = useState<FolderDepthProps[] | undefined>([]);
  const [fetchedFolders, setFetchedFolders] = useState<FolderProps[] | undefined>(undefined);
  const [filteredFolders, setFilteredFolders] = useState<FolderProps[] | undefined>(undefined);
  const [selectFolders, setSelectFolders] = useState<FolderProps[]>(defaultValue || []);

  const pushToDepth = useCallback((item: FolderProps, index: number) => {
    setDepth((prevState) => lodash.concat(prevState || [], lodash.merge(item, {index})));
  }, []);

  const popDepth = useCallback(() => {
    setDepth((prevState) => lodash.dropRight(prevState));
  }, []);

  const foldersChildren = useMemo(() => {
    const path = lodash.flatMapDeep(depth, (depthItem: FolderDepthProps) => [depthItem.index, 'children']);
    if (path?.length) return lodash.get(url ? fetchedFolders : filteredFolders || folders, path);
    return url ? fetchedFolders : filteredFolders || folders;
  }, [depth, fetchedFolders, filteredFolders]);

  useEffect(() => {
    if (url && (!foldersChildren?.length || search?.current?.length || search?.current === null)) {
      const fetchUrl = new URL(
        lodash.isString(url)
          ? url
          : lodash.isFunction(url)
          ? url(depth)
          : lodash.get(url, depth?.length || url?.length - 1)
      );
      const queryFolder =
        search?.current?.length && searchQueryKey
          ? lodash.merge(queryParams || {}, {[searchQueryKey]: search?.current})
          : lodash.merge(queryParams || {}, selectFolderQueryParams(lodash.last(depth)));
      lodash.forEach(lodash.entries(queryFolder), ([key, value]: [string, any]) => {
        if (!lodash.isNil(value)) fetchUrl.searchParams.append(key, value);
      });
      fetch(fetchUrl, {
        headers: headerRequest,
        mode: 'no-cors'
      })
        .then((response) => response.json())
        .then((children: any) => {
          console.log(children);
          const childrenFolder = lodash.isFunction(fetchedChildrenDataPath)
            ? fetchedChildrenDataPath(children)
            : lodash.get(children, fetchedChildrenDataPath);
          const path = lodash.flatMapDeep(depth, (depthItem: FolderDepthProps) => [depthItem.index, 'children']);
          const newFetchedFolders = lodash.cloneWith(
            [...(fetchedFolders || [])],
            (copyFetchedFolders: FolderProps[]) => {
              if (path?.length) {
                lodash.set(copyFetchedFolders, path, childrenFolder);
                return copyFetchedFolders;
              }
              return childrenFolder;
            }
          );
          setFetchedFolders(newFetchedFolders);
        })
        .catch(console.error);
    }
  }, [depth]);

  const onSelectFolder = (folder: FolderProps, checked: boolean) => {
    if (checked) setSelectFolders((prevState) => (mode === 'multiple' ? [...prevState, folder] : [folder]));
    else {
      const newSelectedItem = lodash.cloneWith(selectFolders, (copySelectFolder: FolderProps[]) => {
        lodash.remove(
          copySelectFolder,
          (copyFolder: FolderProps) => lodash.get(copyFolder, valueKey) === lodash.get(folder, valueKey)
        );
        return copySelectFolder;
      });
      setSelectFolders(newSelectedItem);
    }
  };

  const debounceSearch = lodash.debounce((e: ChangeEvent<HTMLInputElement>) => {
    if (url) {
      search.current = e.target.value;
      setFetchedFolders(undefined);
      setDepth((prevState) => (lodash.isArray(prevState) ? undefined : []));
    } else {
      const newFilteredFolders: FolderProps[] = [];
      // @ts-ignore
      lodash?.eachDeep(folders, (node: FolderProps) => {
        if (new RegExp(e.target.value, 'gi').test(lodash.get(node, labelKey))) newFilteredFolders.push(node);
      });
      setFilteredFolders(newFilteredFolders);
    }
  }, 1000);

  const onSaveChanges = () => {
    if (lodash.isFunction(onSave)) onSave(selectFolders);
  };

  return (
    <div className={clsx('drilld container', containerClassName)}>
      <header className="header">
        <h4>{title}</h4>
        {(hasSearch || (url && searchQueryKey)) && (
          <input className="search" name="search" onChange={debounceSearch} placeholder="search ..." />
        )}
        <div className="header-action">
          {!!depth?.length && (
            <button className="back-button" onClick={popDepth}>
              <Back />
              <span>{showFullPath ? backTitle : lodash.last(depth)?.name}</span>
            </button>
          )}
          {showFullPath && (
            <ul className="full-path-container">
              {lodash.map(depth, (folder: FolderProps, index: number) => (
                <li key={index}>
                  <span>{folder?.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </header>
      <main className="body">
        {lodash.isUndefined(foldersChildren) && url ? (
          <Spinner />
        ) : (
          lodash.map(foldersChildren, (folder: FolderProps, index: number) => {
            const isFolder =
              maxDepth > (depth?.length || 0)
                ? lodash.isFunction(folderKey)
                  ? folderKey(folder)
                  : lodash.isBoolean(folderKey)
                  ? folderKey
                  : lodash.get(folder, folderKey) || folder?.children
                : false;
            return (
              <div key={index} className={clsx('folder-container', folderClassName)}>
                <div className="folder-name">
                  {((!isFolder && mode === 'multiple') || (isFolder && isSelectableFolder)) && (
                    <CheckBox
                      checked={
                        lodash.isFunction(checkIsSelected)
                          ? checkIsSelected(folder)
                          : lodash.some(selectFolders, [valueKey, lodash.get(folder, valueKey)])
                      }
                      name={lodash.get(folder, labelKey)}
                      onChange={(checked: boolean) => {
                        onSelectFolder(folder, checked);
                      }}
                    />
                  )}
                  {isFolder ? <Folder /> : <Document />}
                  <span
                    onClick={() => {
                      if (mode !== 'multiple' && !isSelectableFolder && onSave) onSave(folder);
                    }}>
                    {lodash.get(folder, labelKey)}
                  </span>
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
      </main>
      {(mode === 'multiple' || isSelectableFolder) && (
        <footer className="footer">
          <button type="button" className="danger">
            <span>cancel</span>
          </button>
          <button type="button" className="success" onClick={onSaveChanges}>
            <span>save</span>
          </button>
        </footer>
      )}
    </div>
  );
};

export default DrillD;
