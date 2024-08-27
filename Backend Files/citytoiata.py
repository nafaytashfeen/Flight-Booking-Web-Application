import pandas as pd
def write_dictionary(file_to_open) -> dict[str, str]:
    """
    This function will write a dictionary of cities to IATA codes in the format
    {city: IATA}. Run this function only ever once
    """
    dictionary = {}
    df = pd.read_excel(file_to_open)
    
    for index, row in df.iterrows():
        if str(row[0]) != "" or str(row[1]) != '':
            city = row[0].title()
            iata_code = str(row[1]).upper()
            dictionary[city] = iata_code
    
    return dictionary

# file_to_open = '/Users/nafaytashfeen/Personal projects/FTC App/Backend/citytoiata.xlsx'
# city_to_iata = write_dictionary(file_to_open)
# print(city_to_iata)

