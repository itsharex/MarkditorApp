import { Toaster } from "sonner";
import { Editor } from "./feat/editor/Editor";
import { useState } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "./components/ui/resizable";
import { DirectoryPanel } from "./feat/directory_panel/DirectoryPanel";
import useNavigationStore from "./store/navigation";
import { WindowTitleBar } from "./components/title_bar/TitleBar";
import useDocumentStore from "./store/document";
import { Welcome } from "./feat/welcome/Welcome";

const App = () => {
  const showSidePanel = useNavigationStore((state) => state.sidebarExpanded);
  const [panelSize, setPanelSize] = useState(20)
  const onResize = (size: number) => setPanelSize(size)
  const titleBarHeight = 33;

  const hasDoc = useDocumentStore((state) => state.hasDocOpened());

  return (
    <div className="overflow-clip">
      <div style={{ height: titleBarHeight }}>
        <WindowTitleBar />
      </div>
      <div className="flex" style={{ height: `calc(100vh - ${titleBarHeight}px)` }} >
        <Toaster position="bottom-right" richColors closeButton duration={3000} />
        {/* 侧边菜单栏 */}
        {/* <AsideMenuBar /> */}
        <ResizablePanelGroup direction="horizontal">
          {showSidePanel && (
            <>
              <ResizablePanel id="DirectorySidePanel" order={1}
                defaultSize={panelSize} minSize={15} maxSize={45}
                onResize={onResize}>
                <DirectoryPanel /> {/* 侧边文件夹栏 */}
              </ResizablePanel>
              <ResizableHandle id="handle" />
            </>
          )}
          <ResizablePanel id="mainEditor" order={2}>
            {/* 右侧主体 */}
            {hasDoc ? <Editor /> : <Welcome />}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
};

export default App;
