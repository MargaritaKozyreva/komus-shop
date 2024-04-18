import React, { memo } from "react";
import { Layout } from "../../shared/layout";
import "./style.css";

const ConfirmationPage = props => {
  const { header, text } = props;
  return (
    <Layout>
      <div className='confirmation-page'>
        <h2>{header || ""}</h2>
        <p>{text || ""}</p>
      </div>
    </Layout>
  );
};

export default memo(ConfirmationPage);
