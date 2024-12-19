import React, { useState } from 'react';
import { gql, useLazyQuery } from '@apollo/client';
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Selection, Inject, Toolbar, Sort, Filter, Edit, Search } from '@syncfusion/ej2-react-grids';
import { GetAllUsers } from '../../apollo/queries';
import { Header } from '../components';

// gql 태그로 쿼리 감싸기
const GET_ALL_USERS = gql`
  ${GetAllUsers}
`;

const Holders = () => {
  const [limit] = useState(1000); // 한 번에 더 많은 데이터를 가져옴
  const [selectedRows, setSelectedRows] = useState([]); // 선택된 행 데이터

  const [fetchUsers, { loading, error, data, refetch }] = useLazyQuery(GET_ALL_USERS, {
    variables: { skip: 0, limit }, // 서버에서 데이터를 한 번에 가져옴
    fetchPolicy: 'cache-and-network',
    onCompleted: (data) => {
      console.log('Fetched users:', data);
    },
    onError: (error) => {
      console.error('Error fetching users:', error);
    },
  });

  // Fetch users on mount
  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // 데이터 로딩 중
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // GraphQL 데이터 매핑
  const users = data?.getAllUsers?.users.map((user) => ({
    HolderID: user._id,
    HolderName: user.username,
    HolderEmail: user.email,
    HolderBio: user.bio,
    HolderImage: user.profilePic || 'https://via.placeholder.com/50',
    WalletAddr: user.wallet_address || 'N/A',
    Type: user.type,
  }));

  const selectionSettings = { type: 'Multiple', persistSelection: true };
  const editing = { allowDeleting: true, allowEditing: false };

  const handleDelete = () => {
    if (selectedRows.length === 0) {
      alert('No rows selected for deletion!');
      return;
    }

    // 실제로 서버에서 삭제하려면 API 호출 추가
    console.log('Deleting rows:', selectedRows);

    // 삭제 후 데이터 새로 고침
    refetch();
    alert('Selected rows deleted successfully!');
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl shadow-2xl">
      <Header category="Page" title="Holders" />
      <GridComponent
        dataSource={users}
        enableHover={true}
        allowPaging
        toolbar={['Search', { text: 'Delete', prefixIcon: 'e-delete', id: 'Delete' }]}
        pageSettings={{
          pageSize: 10, // 클라이언트에서 한 페이지에 표시할 데이터 수
        }}
        selectionSettings={selectionSettings}
        editSettings={editing}
        allowSorting
        rowSelected={(args) => setSelectedRows((prev) => [...prev, args.data])}
        rowDeselected={(args) => setSelectedRows((prev) => prev.filter((row) => row.HolderID !== args.data.HolderID))}
        toolbarClick={(args) => {
          if (args.item.id === 'Delete') handleDelete();
        }}
      >
        <ColumnsDirective>
          <ColumnDirective type="checkbox" width="50" />
          <ColumnDirective
            field="HolderID"
            headerText="Holder ID"
            width="120"
            textAlign="Left"
            template={(props) => (
              <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                {props.HolderID}
              </div>
            )}
            isPrimaryKey={true}
          />
          <ColumnDirective
            field="HolderName"
            headerText="Name"
            width="120"
            textAlign="Center"
            template={(props) => (
              <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                {props.HolderName}
              </div>
            )}
          />
          <ColumnDirective
            field="HolderEmail"
            headerText="Email"
            width="120"
            textAlign="Center"
            template={(props) => (
              <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                {props.HolderEmail}
              </div>
            )}
          />
          <ColumnDirective
            field="HolderBio"
            headerText="Bio"
            width="120"
            textAlign="Left"
            template={(props) => (
              <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                {props.HolderBio}
              </div>
            )}
          />
          <ColumnDirective
            field="HolderImage"
            headerText="Profile Pic"
            width="120"
            textAlign="Center"
            template={(props) => (
              <div className="flex items-center justify-center">
                <img
                  src={props.HolderImage}
                  alt="Profile"
                  style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                />
              </div>
            )}
          />
          <ColumnDirective
            field="WalletAddr"
            headerText="Wallet Address"
            width="120"
            textAlign="Left"
            template={(props) => (
              <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                {props.WalletAddr}
              </div>
            )}
          />
          <ColumnDirective
            field="Type"
            headerText="Type"
            width="120"
            textAlign="Center"
            template={(props) => (
              <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                {props.Type}
              </div>
            )}
          />
        </ColumnsDirective>
        <Inject services={[Page, Selection, Toolbar, Edit, Sort, Filter, Search]} />
      </GridComponent>
    </div>
  );
};

export default Holders;
