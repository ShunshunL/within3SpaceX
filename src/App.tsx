import './App.css';
import { useQuery, gql } from '@apollo/client';

interface Mission {
  id: number;
  name: string;
  twitter: string;
  manufacturer: string;
  description: string;
  website: string;
  wikipedia: string;
}

interface MissionData {
  missions: Mission[];
}

const GET_MISSIONS = gql`
  query getMissions {
    missions {
      twitter
      name
      manufacturers
      id
      description
      website
      wikipedia
    }
  }
`;

function App() {
  const { loading, error, data } = useQuery<MissionData>(GET_MISSIONS);
  
  if (loading) return <p>Loading...</p>; // could make this pretty too
  if (error) return <p>Error :(</p>; // could use some better error handling here
  
  const headers = data && Object.keys(data.missions[0]).filter(key => key !== 'id' && key !== '__typename');
  console.log(headers);

  return (
    <div className="App">
      <h3> SpaceX missions </h3>
      <table className="styled-table">
        <thead>
            <tr>
                {headers?.map(header => {
                  if (header !== 'id' && header !== "__typename") {
                    return <th key={header}>{header.charAt(0).toUpperCase() + header.slice(1)}</th>
                  }
                  return null;
                }
                )}
            </tr>
        </thead>
        <tbody>
            {data?.missions.map(mission => (
                <tr key={mission.id}>
                    {Object.values(mission).map(value => (
                        value !== "Mission" && value !== mission.id ? <td key={value}>{value}</td> : null
                    ))} 
                </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
