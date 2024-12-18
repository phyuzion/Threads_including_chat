import React from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Selection, Inject, Edit, Toolbar, Sort, Filter } from '@syncfusion/ej2-react-grids';

import { holdersData, holdersGrid } from '../data/dummy';
import { Header } from '../components';

const Contents = () => {
  const selectionSettings = { persistSelection: true };
  const editing = { allowDeleting: true, allowEditing: false };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl shadow-2xl">
      <Header category="Page" title="Holders" />
      <GridComponent
        dataSource={holdersData}
        enableHover={true}
        allowPaging
        pageSettings={{ pageCount: 5 }}
        selectionSettings={selectionSettings}
        toolbar={['Delete']}
        editSettings={editing}
        allowSorting
      >
        <ColumnsDirective>
          {holdersGrid.map((item, index) => <ColumnDirective key={index} {...item} />)}
        </ColumnsDirective>
        <Inject services={[Page, Selection, Toolbar, Edit, Sort, Filter]} />
      </GridComponent>
    </div>
  );
};

export default Contents;
