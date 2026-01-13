import '@mantine/core/styles.css';
import './index.css'
import ReactDOM from "react-dom/client";
import { App } from "./app";
import { MantineProvider } from '@mantine/core';

const root = ReactDOM.createRoot(document.getElementById("root")!); 

root.render(
    <MantineProvider>
      <App />
    </MantineProvider>
)
