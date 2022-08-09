import "./App.css";
import { useQuery, gql } from "@apollo/client";
import React, { useEffect } from "react";

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

enum SortingDirections {
  Ascending = 0,
  Descending = 1,
  Unsorted = 2,
}

export const GET_MISSIONS = gql`
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

export function App() {
  const { loading, error, data } = useQuery<MissionData>(GET_MISSIONS);
  const [missions, setMisssions] = React.useState<Mission[]>([]);
  const [sortingDirections, setSortingDirections] = React.useState(
    {} as { [key: string]: SortingDirections }
  );
  const [inputValue, setInputValue] = React.useState("");

  useEffect(() => {
    data && setMisssions(data.missions);
  }, [data]);

  if (loading) return <p>Loading...</p>; // could make this pretty too
  if (error) return <p>Error :(</p>; // could use some better error handling here

  const headers = ["name", "manufacturers", "description", "links"]; // could populate dynamically if I didn't want to combine the links
  const links = ["twitter", "wikipedia", "website"];

  const directions: { [key: string]: any } = {};
  for (const header of headers) {
    directions[header] = SortingDirections.Unsorted;
  }

  // could store sorted data for efficiency in the future
  const sortColumn = (column: string) => {
    const copyData = [...missions];
    const currentDirection = sortingDirections[column];
    const sortedData = copyData?.sort((a: Mission, b: Mission) => {
      if (
        currentDirection === SortingDirections.Ascending ||
        currentDirection === SortingDirections.Unsorted
      ) {
        if (a[column as keyof Mission] < b[column as keyof Mission]) return -1;
        if (a[column as keyof Mission] > b[column as keyof Mission]) return 1;
        return 0;
      } else {
        if (a[column as keyof Mission] < b[column as keyof Mission]) return 1;
        if (a[column as keyof Mission] > b[column as keyof Mission]) return -1;
        return 0;
      }
    });
    const nextDirection =
      currentDirection === SortingDirections.Ascending ||
      currentDirection === SortingDirections.Unsorted
        ? SortingDirections.Descending
        : SortingDirections.Ascending;
    const nextDirections: { [key: string]: any } = { ...sortingDirections };
    nextDirections[column] = nextDirection;
    setMisssions(sortedData);
    setSortingDirections(nextDirections);
  };

  const getFilteredRows = (rows: Mission[], filter: string) => {
    return rows.filter((row: Mission) => {
      return Object.values(row).some((value: string) =>
        value?.toString().toLowerCase().includes(filter.toLowerCase())
      );
    });
  };

  return (
    <div className="App">
      <h1> SpaceX Missions </h1>
      <input
        placeholder="Type to Search"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      {/* could make Table it's own component */}
      <table className="styled-table">
        <thead>
          <tr>
            {headers?.map((header) => {
              return (
                <th key={header} onClick={() => sortColumn(header)}>
                  {header.charAt(0).toUpperCase() + header.slice(1)}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {getFilteredRows(missions, inputValue).map((mission) => (
            <tr key={mission.id}>
              {headers?.map((header) => {
                if (header === "links") {
                  return (
                    <td key={header + mission.id}>
                      <ul>
                        {links.map((link, index) => {
                          const anchorLink = mission[link as keyof Mission];
                          return (
                            anchorLink && (
                              <li key={link + index}>
                                <a href={anchorLink as string}>{link}</a>
                              </li>
                            )
                          );
                        })}
                      </ul>
                    </td>
                  );
                }
                return <td key={header}>{mission[header as keyof Mission]}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
