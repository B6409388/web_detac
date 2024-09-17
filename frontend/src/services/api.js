const url = "http://localhost:3000/api";

export const createLicensePlate = async (data) => {
  const response = await fetch(`${url}/data`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
};
