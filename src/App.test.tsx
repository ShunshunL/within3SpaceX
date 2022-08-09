import { render, screen } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { GET_MISSIONS, App } from "./App";

const mocks = [
  {
    request: {
      query: GET_MISSIONS,
      variables: {},
    },
    result: {
      data: {
        missions: [
          {
            twitter: "https://twitter.com/thaicomplc",
            name: "Thaicom",
            manufacturers: ["Orbital ATK"],
            id: "9D1B7E0",
            description:
              "Thaicom is the name of a series of communications satellites operated from Thailand, and also the name of Thaicom Public Company Limited, which is the company that owns and operates the Thaicom satellite fleet and other telecommunication businesses in Thailand and throughout the Asia-Pacific region. The satellite projects were named Thaicom by the King of Thailand, His Majesty the King Bhumibol Adulyadej, as a symbol of the linkage between Thailand and modern communications technology.",
            website: "http://www.thaicom.net/en/satellites/overview",
            wikipedia: "https://en.wikipedia.org/wiki/Thaicom",
          },
        ],
      },
    },
  },
];

test("should render table when missions is not empty", async () => {
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <App />
    </MockedProvider>
  );
  expect(await screen.findByText("SpaceX Missions")).toBeInTheDocument();
  expect(await screen.findByText(/tal ATK/)).toBeInTheDocument();
  expect(screen.queryByText(/9D1B7E0/)).not.toBeInTheDocument();
  const table = await screen.findByRole("table");
  expect(table).toBeInTheDocument();
  const rows = await screen.findAllByRole("row");
  expect(rows.length).toBe(2);
});
