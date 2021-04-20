import Head from "next/head";
import styles from "../styles/Home.module.css";
import stylesLess from "../styles/Home.module.less";
import { Button, Tooltip } from "antd";
import { SearchOutlined } from "@ant-design/icons";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Next.js + Less CSS</title>
      </Head>
      <h1 className={stylesLess.title}>Next.js + Less CSS</h1>

      <Tooltip title="Example AntD Tooltip">
        <Button type="primary" icon={<SearchOutlined />}>
          Example AntD button
        </Button>
      </Tooltip>
    </div>
  );
}
