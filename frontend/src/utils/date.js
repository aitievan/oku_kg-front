export function formatDate(dateValue) {
  try {
    let date;
    
    
    if (Array.isArray(dateValue)) {
    
      date = new Date(
        dateValue[0],          
        dateValue[1] - 1,     
        dateValue[2],          
        dateValue[3],          
        dateValue[4],        
        dateValue[5] || 0,     
        dateValue[6] ? dateValue[6] / 1000000 : 0 
      );
    } else {
      date = new Date(dateValue);
    }
    
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${day}.${month}.${year} ${hours}:${minutes}`;
  } catch (error) {
    console.error("Ошибка форматирования даты:", error);
    return "Ошибка даты";
  }
}