import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { editorAction, getVditor } from './editor'
import useDocumentStore from './document'
import useDirectoryStore from './directory'
import { EnvConstants } from '@/utils/constants'
import i18n from '@/i18n/i18n'

export type PrefThemeMode = "light" | "dark" | "system";

export type RealThemeMode = "light" | "dark";

interface PreferenceState {
  prefThemeMode: PrefThemeMode, // Default to "system"
  autoSaveInerval: number, // Default to 8000 ms
  autoSave: boolean, // Default to true
  fileHistory: string[], // Path to file
  folderHistory: string[], // Path to folder
  defaultShowToolbar: boolean, // Default to true
  languageCode: string, // Default to "en-US"
}

interface PreferenceComputedState {
  themeMode: () => RealThemeMode,
}

const defaultState: PreferenceState = {
  prefThemeMode: "system",
  autoSaveInerval: 5000,
  autoSave: true,
  defaultShowToolbar: true,
  fileHistory: [],
  folderHistory: [],
  languageCode: "en-US",
}

const usePreferenceStore = create(
  persist<PreferenceState & PreferenceComputedState>(
    (set, get) => {
      const languageCode = navigator.language || "en-US"
      return {
        ...defaultState,
        languageCode,

        themeMode: function () {
          if (get().prefThemeMode === "system") {
            return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
          }
          return get().prefThemeMode === "light" ? "light" : "dark"
        }
      }
    },

    { name: 'markditor-pref-storage' },
  )
)

const { setState, getState, subscribe } = usePreferenceStore

class PreferenceActions {
  public setLanguageCode(code: string) {
    i18n.changeLanguage(code)
    setState((state) => ({ ...state, languageCode: code }))
  }

  public setThemeMode(prefThemeMode: PrefThemeMode) {
    setState((state) => ({ ...state, prefThemeMode }))
    editorAction.syncTheme()
  }

  public appendFileHistory(filePath: string) {
    const history = getState().fileHistory.filter(
      (path, index) => path !== filePath && index < EnvConstants.MAX_HISTORY_LENGTH
    )

    setState((state) => ({ ...state, fileHistory: [filePath, ...history] }))
  }

  public appendFolderHistory(folderPath: string) {
    const history = getState().folderHistory.filter(
      (path, index) => path !== folderPath && index < EnvConstants.MAX_HISTORY_LENGTH
    )
    setState((state) => ({ ...state, folderHistory: [folderPath, ...history] }))
  }

  // TODO 在打开文件失败时，从历史记录移除该文件
  public removeFromFileHistory(filePath: string) {
    const history = getState().fileHistory.filter((path) => path !== filePath)
    setState((state) => ({ ...state, fileHistory: history }))
  }

  // TODO 在打开文件夹失败时，从历史记录移除该文件夹
  public removeFromFolderHistory(folderPath: string) {
    const history = getState().folderHistory.filter((path) => path !== folderPath)
    setState((state) => ({ ...state, folderHistory: history }))
  }

  public clearAllHistory() {
    setState((state) => ({ ...state, fileHistory: [], folderHistory: [] }))
  }

  public setDefaultShowToolbar(defaultShowToolbar: boolean) {
    setState((state) => ({ ...state, defaultShowToolbar }))
  }

  public toggleAutoSave(autoSave: boolean) {
    setState((state) => ({ ...state, autoSave }))
  }

  public setAutoSaveInerval(interval: number) {
    if (interval < 1000 || interval > 2147483647) return
    setState((state) => ({ ...state, autoSaveInerval: interval }))
  }

  public toggleDefaultShowToolbar(show: boolean) {
    setState((state) => ({ ...state, defaultShowToolbar: show }))
  }
}

export function initDirectoryOpenListener() {
  const unsubscribeFile = useDocumentStore.subscribe((state, prevState) => {
    if (state.path !== undefined && state.path !== prevState.path) {
      prefActions.appendFileHistory(state.path)
    }
  })

  const unsubscribeFolder = useDirectoryStore.subscribe((state, prevState) => {
    if (state.root !== undefined && state.root !== prevState.root) {
      prefActions.appendFolderHistory(state.root.path)
    }
  })

  return () => {
    unsubscribeFile()
    unsubscribeFolder()
  }
}

export const prefActions = new PreferenceActions()

export default usePreferenceStore