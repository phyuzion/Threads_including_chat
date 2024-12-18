import React from "react";
import {
  GridComponent,
  Inject,
  ColumnsDirective,
  ColumnDirective,
  Search,
  Page,
  Toolbar,
} from "@syncfusion/ej2-react-grids";

import { scannerData, scannerGrid } from "../data/dummy";
import { Header } from "../components";

const Wallets = ({ title, walletAddress }) => {
  const toolbarOptions = ['Search'];

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl shadow-2xl">
      <Header category="Page" title={title} />
      <p className="text-lg font-semibold mt-4">
        Address: {walletAddress}
      </p>
      <GridComponent
        dataSource={scannerData}
        width="auto"
        allowPaging
        allowSorting
        pageSettings={{ pageCount: 5 }}
        toolbar={toolbarOptions}
      >
        <ColumnsDirective>
          {scannerGrid.map((item, index) => (
            <ColumnDirective key={index} {...item} />
          ))}
        </ColumnsDirective>
        <Inject services={[Search, Page, Toolbar]} />
      </GridComponent>
    </div>
  );
};

export default Wallets;
