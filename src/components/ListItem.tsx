import { ReactNode } from "react"

export interface ListItemProps {
  leading?: ReactNode,
  leadingSpace?: number,
  children: ReactNode,
  trailing?: ReactNode,
  onClick: () => void,
  className?: string
}

export function ListItem({ leading, leadingSpace, children, trailing, onClick, className }: ListItemProps) {
  return (
    <button onClick={onClick}
      className={`flex px-2 py-1 ${(className ?? "")} w-full`}>
      <div className="flex-shrink-0 self-center h-full" style={{ paddingLeft: leadingSpace ?? 0 }}>
        {leading}
      </div>

      {/* <div style={{ width: 20 * props.depth }}></div>
      {fileIcon} */}

      <div className="ml-0.5 select-none text-sm text-ellipsis text-left text-nowrap line-clamp-1 break-all">
        {children}
      </div>

      <div className="flex-1"></div>

      {trailing}
    </button>
  )
}