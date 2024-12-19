import React, { useState } from 'react';
import { gql, useLazyQuery } from '@apollo/client';
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Selection, Inject, Edit, Toolbar, Sort, Filter, Search } from '@syncfusion/ej2-react-grids';
import { GetAllPosts } from '../../apollo/queries';
import { Header } from '../components';

// gql 태그로 쿼리 감싸기
const GET_ALL_POSTS = gql`
  ${GetAllPosts}
`;

const Contents = () => {
  const [limit] = useState(1000); // 한 번에 더 많은 데이터를 가져옴
  const [mediaPreview, setMediaPreview] = useState({ open: false, url: '', type: '' }); // 미디어 미리보기 상태
  const [selectedRows, setSelectedRows] = useState([]); // 선택된 행 데이터

  const [fetchPosts, { loading, error, data, refetch }] = useLazyQuery(GET_ALL_POSTS, {
    variables: { skip: 0, limit }, // 서버에서 한 번에 데이터를 가져옴
    fetchPolicy: 'cache-and-network',
    onCompleted: (data) => {
      console.log('Fetched posts:', data);
    },
    onError: (error) => {
      console.error('Error fetching posts:', error);
    },
  });

  // Fetch posts on mount
  React.useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // 데이터 로딩 중
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // GraphQL 데이터 매핑
  const posts = data?.getAllPosts?.posts.map((post) => ({
    PostID: post._id,
    PostedBy: post.postedBy,
    Media: post.img || post.video || null,
    MediaType: post.img ? 'image' : post.video ? 'video' : null,
    Text: post.text,
    Hashtags: post.hashtags.join(', '),
    Star: post.star,
    CreatedAt: new Date(post.createdAt).toLocaleString(),
  }));

  const selectionSettings = { type: 'Multiple', persistSelection: true };
  const editing = { allowDeleting: true, allowEditing: false };

  const handleMediaClick = (url, type) => {
    setMediaPreview({ open: true, url, type });
  };

  const closePreview = () => {
    setMediaPreview({ open: false, url: '', type: '' });
  };

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
      <Header category="Page" title="Posts" />
      <GridComponent
        dataSource={posts}
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
        rowDeselected={(args) => setSelectedRows((prev) => prev.filter((row) => row.PostID !== args.data.PostID))}
        toolbarClick={(args) => {
          if (args.item.id === 'Delete') handleDelete();
        }}
      >
        <ColumnsDirective>
          <ColumnDirective type="checkbox" width="50" />
          <ColumnDirective
            field="PostID"
            headerText="ID"
            width="120"
            textAlign="Center"
            template={(props) => (
              <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                {props.PostID}
              </div>
            )}
          />
          <ColumnDirective
            field="PostedBy"
            headerText="Posted By"
            width="120"
            textAlign="Center"
            template={(props) => (
              <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                {props.PostedBy}
              </div>
            )}
          />
          <ColumnDirective
            field="Media"
            headerText="Media"
            width="120"
            textAlign="Center"
            template={(props) => (
              props.Media ? (
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleMediaClick(props.Media, props.MediaType);
                  }}
                  style={{ color: '#1a73e8', textDecoration: 'underline', cursor: 'pointer', whiteSpace: 'normal', wordWrap: 'break-word' }}
                >
                  {props.Media}
                </a>
              ) : (
                <span>No media</span>
              )
            )}
          />
          <ColumnDirective
            field="Text"
            headerText="Text"
            width="120"
            textAlign="Left"
            template={(props) => (
              <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                {props.Text}
              </div>
            )}
          />
          <ColumnDirective
            field="Hashtags"
            headerText="Hashtags"
            width="120"
            textAlign="Left"
            template={(props) => (
              <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                {props.Hashtags}
              </div>
            )}
          />
          <ColumnDirective
            field="Star"
            headerText="Star"
            width="120"
            textAlign="Center"
            template={(props) => (
              <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                {props.Star}
              </div>
            )}
          />
          <ColumnDirective
            field="CreatedAt"
            headerText="Created At"
            width="120"
            textAlign="Center"
            template={(props) => (
              <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                {props.CreatedAt}
              </div>
            )}
          />
        </ColumnsDirective>
        <Inject services={[Page, Selection, Toolbar, Edit, Sort, Filter, Search]} />
      </GridComponent>

      {/* 미디어 미리보기 팝업 */}
      {mediaPreview.open && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1000,
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0px 4px 6px rgba(0,0,0,0.1)',
          }}
        >
          {mediaPreview.type === 'image' ? (
            <img
              src={mediaPreview.url}
              alt="Media Preview"
              style={{ maxWidth: '100%', maxHeight: '500px', borderRadius: '10px' }}
            />
          ) : (
            <video
              src={mediaPreview.url}
              controls
              style={{ maxWidth: '100%', maxHeight: '500px', borderRadius: '10px' }}
            />
          )}
          <button
            onClick={closePreview}
            style={{
              marginTop: '10px',
              backgroundColor: '#1a73e8',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default Contents;
