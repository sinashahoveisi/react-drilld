import React from 'react';
import {DrillD} from 'react-drilld';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/*<DrillD title="sina" folders={[{name: 'sina', children: [{name: 'sina2'}, {name: 'sina3'}]}]} />*/}
        {/*<DrillD*/}
        {/*  title="sina"*/}
        {/*  showFullPath*/}
        {/*  folders={[{name: 'sina', children: [{name: 'sina2', children: [{name: 'ali'}]}, {name: 'sina3'}]}]}*/}
        {/*/>*/}
        <DrillD
          title="sina"
          url="https://a.behzee.com/general/v1/diseases/children"
          headerRequest={{
            Authorization:
              'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiOTJjNzNkNjk1NGVhYjU5NDI3NzEwYmU4Y2QxZTNkYjNiNzYzMmEyOTc2M2QxNjBiM2Q3MmVkZWE3M2VlYzYxMmJkOWI1YjM3ZTY2MzY5ZTYiLCJpYXQiOjE2NTUwNjM3ODQuMjg1NjMzLCJuYmYiOjE2NTUwNjM3ODQuMjg1NjM4LCJleHAiOjE2NTU2Njg1ODQuMjY5NSwic3ViIjoiMzg4MCIsInNjb3BlcyI6WyJhZG1pbiJdfQ.dK58MhGFwBDB5eHTwKJ0X_UTVYQTbePBiHKTYMn3ZEOMCQBqZ2ofp0wObeaF-Df2undM5bveYh4v7lFfbWXjUJWUJOFYgY_JJZwzmAcOr1baYbv5kg0-_-lKHlBrR9Y9s44ULkUofUhfC6A2HZF-BoWT4R8XjTV7cIkxf-nd6qAKYe5wkkvCMiyqWIlz94NpDaDVgxkoBs18vJ9HKiOmuDrVOwL9R0uRfZUmot5aVlZRTQ9CRi1rnlEDdXHqi56ZlwqBd90zIodfwDp1mFITAqG5TP2l-RpP_0RPx1q7NJV0HRPgseOy9vBozxTHJebKgKKlIqgPpqSfdbrmXldRSTRkG_z9BkfWnCF2tInN9_UK7mkwkLWpv9h9jecms436PnIGdbHelK6jRjlkarH3kwxwjl4envuYtdKTfFABIVQtDBIt3IUCNswoyPr8D6aRtpWk92Ykl5JVWq_nxG2sULX-1mnjYZJW26ZQr77_VzcbhpvmKWA1wlbkGnREaUvPDix6n7omKDb2eECIVvmSHKafDw7K8u01RDbcIqSPHcvqtl08TOgQkTcKSZ5r43bgM38YrW-To57CTn-FmykbKVSOogNzQJVA-gWa3EaYVPe-vd3tz7wU_UhdoqGHxAC3pu7kK8ZUFnhTmsYAYG5aY2m9C5t89wgX7jcLAEBYIGw'
          }}
          selectFolderQueryParams={(folder: any) => ({parent_id: folder?.id})}
          fetchedChildrenDataPath={['data']}
          isFolderProps="is_parent"
        />
      </header>
    </div>
  );
}

export default App;
