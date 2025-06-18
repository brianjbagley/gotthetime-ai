exports.handler = async (event, context) => {
  const now = new Date();
  
  // Convert to Mountain Time
  const mtTime = new Date(now.toLocaleString("en-US", {timeZone: "America/Denver"}));
  
  // Format as YYMMDDHHMMT
  const year = mtTime.getFullYear().toString().slice(-2);
  const month = (mtTime.getMonth() + 1).toString().padStart(2, '0');
  const day = mtTime.getDate().toString().padStart(2, '0');
  const hour = mtTime.getHours().toString().padStart(2, '0');
  const minute = mtTime.getMinutes().toString().padStart(2, '0');
  
  const timeString = `${year}${month}${day}${hour}${minute}MT`;
  
  return {
    statusCode: 200,
    body: timeString
  };
};
