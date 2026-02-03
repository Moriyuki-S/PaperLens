import { PdfViewer } from './features/pdf-viewer';
import { cn } from './lib/utils';

function App() {
    return (
        <div className={cn(['fixed inset-0', 'flex flex-col'])}>
            <PdfViewer className={cn(['h-full w-full'])} />
        </div>
    );
}

export default App;
