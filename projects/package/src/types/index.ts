

export interface FolderProps {
    name: string;
    isFolder?: boolean;
    children: FolderProps;
}

export interface DrillDProps {
    title?: string;
    folders: FolderProps;
    showFullPath?: boolean;
    folderClassName?: string;
    containerClassName?: string;
    backTitle?: string;
}