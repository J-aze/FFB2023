print("accueil = 1")
print("poste déchange = 2")
section = input("sur quelle stand vous trouvez vous ? ")


import recuperation_du_capteur_RFID_interaction_database
import recuperation_du_capteur_RFID_vers_database




if section == "1" :
    recuperation_du_capteur_RFID_vers_database.init()
    print("accueil")

elif section == "2" :
    recuperation_du_capteur_RFID_interaction_database.init()
    print("poste déchange")

else :
    print("erreur")
