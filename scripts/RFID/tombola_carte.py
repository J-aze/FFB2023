## import des librairies
import interaction_database
import lecture_des_id_tombola

## iniatialisation des variables

# Recuperation des ticket de tombola déjà distrubuer

ticket_distrubuer = lecture_des_id_tombola.lecture_des_id_tombola()


tab_ticket_distrubuer = []
ID = -1

if len(ticket_distrubuer) > 0 :                
    for ID_ticket in ticket_distrubuer :
        ticket_analyse = ID_ticket[0]
        if int(ticket_analyse) < 10000 :
            dernier_ticket = ID_ticket
    tab_ticket_distrubuer.append(dernier_ticket[0])
    print (tab_ticket_distrubuer)
else : 
    tab_ticket_distrubuer.append(1)
#print (ID_RFID)


def main(ID_RFID,nbr_ticket) :
    ticket_genere = []
    for i in range (int(nbr_ticket)) :
        num_ticket = len(tab_ticket_distrubuer)
        tab_ticket_distrubuer.append(tombola(num_ticket))
        ticket_genere.append(tombola(num_ticket))
    print (tab_ticket_distrubuer)
    print (ticket_genere)
    for ticket in ticket_genere :
        print (ticket)
        envo_ticker_to_datbase(ID_RFID, ticket)
    

def tombola(num_ticket) : 
    num_ticket += 1
    return num_ticket


def envo_ticker_to_datbase(ID_RFID, num_tiket):
    interaction_database.ajout_profil_ticket_tombola(ID_RFID, num_tiket)

    ...
