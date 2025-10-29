import { PdfViewer } from './components/PdfViewer';

function App() {
    return (
        <main className="container mx-auto flex h-screen flex-col gap-4 p-6">
            <header className="flex flex-col gap-2">
                <h1 className="text-2xl font-semibold">PaperLens</h1>
                <p className="text-sm text-foreground-500">
                    下のビューアからPDFファイルを選択してプレビューできます。
                </p>
            </header>

            <section className="flex-1 overflow-hidden rounded-large border border-default-200 bg-content1 shadow-sm">
                <PdfViewer />
            </section>
        </main>
    );
}

export default App;
