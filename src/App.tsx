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
  link: string;
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
  
  // const headers = data && Object.keys(data.missions[0]).filter(key => key !== 'id' && key !== '__typename');
  const headers = ['name', 'manufacturers', 'description', 'socials']
  const links = ['twitter', 'wikipedia', 'website'];
  console.log(data);

  return (
    <div className="App">
      <h3> SpaceX Missions </h3>
      <table className="styled-table">
        <thead>
            <tr>
                {headers?.map(header => {
                    return <th key={header}>{header.charAt(0).toUpperCase() + header.slice(1)}</th>
                  }
                )}
            </tr>
        </thead>
        <tbody>
            {data?.missions.map(mission => (
                <tr key={mission.id}>
                    {headers?.map(header => {
                        if (header === 'socials') {
                          return <td>
                          <ul>
                            {links.map(link => {
                                const anchorLink = mission[link as keyof Mission];
                                return anchorLink && <li><a key={link} href={anchorLink as string}>{link}</a></li>;
                              }
                            )}
                          </ul>
                          </td>
                        } 
                        return <td key={header}>{mission[header as keyof Mission]}</td>
                      }
                    )}
                    
                </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
