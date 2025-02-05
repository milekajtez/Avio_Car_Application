﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using AvioCarBackend.Data;
using AvioCarBackend.Data.register_and_login;
using AvioCarBackend.Data.regular_user;
using AvioCarBackend.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using Microsoft.Extensions.Options;

namespace AvioCarBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegularUserController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<RegisteredUser> _userManager;
        private readonly MailSettings _mailSettings;

        public RegularUserController(ApplicationDbContext context, UserManager<RegisteredUser> userManager,
            IOptions<MailSettings> mailSettings)
        {
            _context = context;
            _userManager = userManager;
            _mailSettings = mailSettings.Value;
        }

        #region 1 - Izmena korisnika na osnnovu prosledjenog username-a
        [HttpPut]
        [Route("ChangeRegularUserProfile")]
        public async Task<Object> ChangeRegularUserProfile(RegularUserModel model)
        {
            var resultFind = await _userManager.FindByNameAsync(model.CurrentUsername);

            if (resultFind == null)
            {
                return NotFound("Change unsucessfully. User is not registred.");
            }

            if (model.UserName == null && model.Email == null && model.PhoneNumber == null && model.FirstName == null &&
                model.LastName == null && model.City == null && model.NumberOfPassport == null && model.Points == null)
            {
                return BadRequest("Change unsucessfully.You must enter new data in form.");
            }

            if (model.UserName != null && await _userManager.FindByNameAsync(model.UserName) != null && !model.UserName.Trim().Equals(""))
            {
                return BadRequest("Change unsucessfully.Please input different username.");
            }

            resultFind.UserName = model.UserName == null || model.UserName.Trim().Equals("") ? resultFind.UserName : model.UserName;
            resultFind.Email = model.Email == null || model.Email.Trim().Equals("") ? resultFind.Email : model.Email;
            resultFind.PhoneNumber = model.PhoneNumber == null || model.PhoneNumber.Trim().Equals("") ? resultFind.PhoneNumber : model.PhoneNumber;
            resultFind.FirstName = model.FirstName == null || model.FirstName.Trim().Equals("") ? resultFind.FirstName : model.FirstName;
            resultFind.LastName = model.LastName == null || model.LastName.Trim().Equals("") ? resultFind.LastName : model.LastName;
            resultFind.City = model.City == null || model.City.Trim().Equals("") ? resultFind.City : model.City;
            resultFind.NumberOfPassport = model.NumberOfPassport == null || model.NumberOfPassport.Trim().Equals("") ? resultFind.NumberOfPassport : model.NumberOfPassport;
            resultFind.Points = model.Points == null || model.Points.Trim().Equals("") ? resultFind.Points : int.Parse(model.Points);

            try
            {
                await _userManager.UpdateAsync(resultFind);
                return Ok(new { message = resultFind.UserName });
            }
            catch (Exception e)
            {
                throw e;
            }
        }
        #endregion
        #region 2 - Metoda za ucitavanje zahteva
        [HttpGet]
        [Route("GetRequests/{username}/{typeOfLoad}")]
        public async Task<Object> GetRequests(string username, string typeOfLoad)
        {
            var findUserResult = await _userManager.FindByNameAsync(username);
            if (findUserResult == null)
            {
                return NotFound("Loading requests failed. Server not found you on database.");
            }

            string jmbg = findUserResult.Id;                                    // moj jmbg
            var allRequests = _context.FriendshipRequests;                      // sve veze izmedju prijatelja i potencijalnih prijatelja
            List<string> myPotentialFriends = new List<string>();               // lista jmng-a kojima sam poslao zahtev koji je aktivan

            foreach (var request in allRequests)
            {
                if (typeOfLoad.Equals("myRequests"))
                {
                    // ako sam ja sender i ako jos nije odgovoreno na zahtev
                    if (request.SenderJMBG.ToString().Equals(jmbg) && request.RequestAccepted == false)
                    {
                        myPotentialFriends.Add(request.RecieverJMBG.ToString());
                    }
                }
                else
                {
                    // ako sam ja receiver i ako jos nije odgovoreno na zahtev
                    if (request.RecieverJMBG.ToString().Equals(jmbg) && request.RequestAccepted == false)
                    {
                        myPotentialFriends.Add(request.SenderJMBG.ToString());
                    }
                }
            }

            // sada je u listi myPotentialFriends jbmg- ovi drugih user-a koji su samnom u nekoj vezi
            // (sve zavisi od vrste request-ova koji mi trebaju)
            if (myPotentialFriends.Count == 0)
            {
                return NotFound("Current user haven't any request in active mode.");
            }

            // sada cu da kreiram objekte koje saljem sa front (username + firstname + lastname)
            List<Friend> result = new List<Friend>();
            foreach (var potJMBG in myPotentialFriends)
            {
                try
                {
                    var user = await _userManager.FindByIdAsync(potJMBG);
                    result.Add(new Friend()
                    {
                        Username = user.UserName,
                        Firstname = user.FirstName,
                        Lastname = user.LastName
                    });
                }
                catch (Exception e)
                {
                    throw e;
                }
            }

            return Ok(result);
        }
        #endregion
        #region 3 - Metoda za slanje zahteva
        [HttpPost]
        [Route("SendRequest/{myUserName}")]
        public async Task<Object> SendRequest(string myUserName, Friend model)
        {
            var userI = await _userManager.FindByNameAsync(myUserName);
            if (userI == null)
            {
                return NotFound("Sending request failed. Server not found current user.");
            }

            var userNewFriend = await _userManager.FindByNameAsync(model.Username);
            if (userNewFriend == null)
            {
                return NotFound("Sending request failed. Server not found entered user. Please enter different username.");
            }

            if (myUserName.Equals(model.Username))
            {
                return NotFound("Sending request failed. Disabling sending requests to yourself.");
            }

            FriendshipRequest friendshipRequest = new FriendshipRequest()
            {
                SenderJMBG = long.Parse(userI.Id),
                RecieverJMBG = long.Parse(userNewFriend.Id),
                RequestAccepted = false
            };

            var find1 = _context.FriendshipRequests.Find(friendshipRequest.SenderJMBG, friendshipRequest.RecieverJMBG);
            if (find1 != null)
            {
                if (find1.RequestAccepted == false)
                {
                    // ne moze jer sam mu vec poslao zahtev
                    return NotFound("Sending request failed because you already send requst to entered user.");
                }

                // ne moze jer smo vec prijatelji (na moju inicijaltivu)
                return NotFound("Sending request failed.Entered user and you are friends already.");
            }

            friendshipRequest.SenderJMBG = long.Parse(userNewFriend.Id);
            friendshipRequest.RecieverJMBG = long.Parse(userI.Id);
            var find2 = _context.FriendshipRequests.Find(friendshipRequest.SenderJMBG, friendshipRequest.RecieverJMBG);
            if (find2 != null)
            {
                if (find2.RequestAccepted == false)
                {
                    // ne moze jer je on meni posalo zahtev
                    return NotFound("Sending request failed because entered user already send request to you.");
                }

                // ne moze jer smo vec prijatelji (na njegovu inicijativu)
                return NotFound("Sending request failed.Entered user and you are friends already.");
            }

            friendshipRequest.SenderJMBG = long.Parse(userI.Id);
            friendshipRequest.RecieverJMBG = long.Parse(userNewFriend.Id);

            try
            {
                _context.FriendshipRequests.Add(friendshipRequest);
                _context.SaveChanges();
                return Ok();
            }
            catch (Exception e)
            {
                throw e;
            }
        }
        #endregion
        #region 4 - Metoda za otkazivanje aktivnog zahteva kog sam poslao/kog sam primio
        [HttpDelete]
        [Route("DeleteMyRequest/{myUsername}/{friendUsername}")]
        public async Task<ActionResult<FriendshipRequest>> DeleteMyRequest(string myUsername, string friendUsername)
        {
            var userI = await _userManager.FindByNameAsync(myUsername);
            if (userI == null)
            {
                return NotFound("Deleting failed. Server not found you in base.");
            }

            var userFriend = await _userManager.FindByNameAsync(friendUsername);
            if (userFriend == null)
            {
                return NotFound("Deleting failed. Server not found friend for deleting.");
            }

            var resultI = _context.FriendshipRequests.Find(long.Parse(userI.Id), long.Parse(userFriend.Id));
            var resultF = _context.FriendshipRequests.Find(long.Parse(userFriend.Id), long.Parse(userI.Id));

            if (resultI == null && resultF == null)
            {
                return NotFound("Deleting failed. You not friend with selected user.");
            }
            else
            {
                if (resultI != null)
                {
                    _context.FriendshipRequests.Remove(resultI);
                    _context.SaveChanges();
                    return resultI;
                }
                else
                {
                    _context.FriendshipRequests.Remove(resultF);
                    _context.SaveChanges();
                    return resultF;
                }
            }
        }
        #endregion
        #region 5 - Metoda za potvrdu zahteva za prijateljstvo
        [HttpGet]
        [Route("ConfirmRequest/{myUsername}/{friendUsername}")]
        public async Task<Object> ConfirmRequest(string myUsername, string friendUsername)
        {
            var userI = await _userManager.FindByNameAsync(myUsername);
            if (userI == null)
            {
                return NotFound("Confirm failed. Server not found you in base.");
            }

            var userFriend = await _userManager.FindByNameAsync(friendUsername);
            if (userFriend == null)
            {
                return NotFound("Confirm failed. Server not found friend for deleting.");
            }

            var result = _context.FriendshipRequests.Find(long.Parse(userFriend.Id), long.Parse(userI.Id));
            if (result == null)
            {
                return NotFound("Confirm request failed. Server not found request in base.");
            }
            else
            {
                result.RequestAccepted = true;
                _context.FriendshipRequests.Update(result);
                _context.SaveChanges();
                return Ok(result);
            }
        }
        #endregion
        #region 6 - Metoda za ucitavanje svih prijatelja odredjenog korisnika
        [HttpGet]
        [Route("LoadMyFriends/{myUserName}")]
        public async Task<Object> LoadMyFriends(string myUserName)
        {
            var userI = await _userManager.FindByNameAsync(myUserName);
            if (userI == null)
            {
                return NotFound("Loading friends failed. Server not found you in database");
            }

            var allRequests = _context.FriendshipRequests;
            List<Friend> result = new List<Friend>();

            foreach (var request in allRequests)
            {
                if ((request.RecieverJMBG.ToString().Equals(userI.Id) || request.SenderJMBG.ToString().Equals(userI.Id)) && request.RequestAccepted)
                {
                    if (request.RecieverJMBG.ToString().Equals(userI.Id))
                    {
                        var currentUser = await _userManager.FindByIdAsync(request.SenderJMBG.ToString());
                        result.Add(new Friend()
                        {
                            Username = currentUser.UserName,
                            Firstname = currentUser.FirstName,
                            Lastname = currentUser.LastName,
                            Phonenumber = currentUser.PhoneNumber
                        });
                    }
                    else
                    {
                        var currentUser = await _userManager.FindByIdAsync(request.RecieverJMBG.ToString());
                        result.Add(new Friend()
                        {
                            Username = currentUser.UserName,
                            Firstname = currentUser.FirstName,
                            Lastname = currentUser.LastName,
                            Phonenumber = currentUser.PhoneNumber
                        });
                    }
                }
            }

            if (result.Count == 0)
            {
                return NotFound("Loading frineds failed becaouse current user not have any friend.");
            }

            return Ok(result);
        }
        #endregion
        #region 7 - Metoda za brisanje prijatelja
        [HttpDelete]
        [Route("DeleteFriend/{myUsername}/{friendUsername}")]
        public async Task<ActionResult<FriendshipRequest>> DeleteFriend(string myUsername, string friendUsername)
        {
            var userI = await _userManager.FindByNameAsync(myUsername);
            if (userI == null)
            {
                return NotFound("Deleting failed. Server not found you in base.");
            }

            var userFriend = await _userManager.FindByNameAsync(friendUsername);
            if (userFriend == null)
            {
                return NotFound("Deleting failed. Server not found friend for deleting.");
            }

            var allRequests = _context.FriendshipRequests;
            var findFriend = new FriendshipRequest();
            bool isFind = false;
            foreach (var request in allRequests)
            {
                if (request.RequestAccepted && ((request.SenderJMBG == long.Parse(userI.Id) &&
                    request.RecieverJMBG == long.Parse(userFriend.Id)) || (request.RecieverJMBG == long.Parse(userI.Id) &&
                    request.SenderJMBG == long.Parse(userFriend.Id))))
                {
                    findFriend = request;
                    isFind = true;
                    break;
                }
            }

            if (isFind)
            {
                try
                {
                    _context.FriendshipRequests.Remove(findFriend);
                    _context.SaveChanges();
                    return Ok();
                }
                catch (Exception e)
                {
                    throw e;
                }
            }
            else
            {
                return NotFound("Deleting failed. These two user are not friends.");
            }
        }
        #endregion
        #region 8 - Metoda koja proverava ispravnost passport-a odredjenog korisnika
        [HttpGet]
        [Route("CheckPassport/{username}/{passportNumber}")]
        public async Task<Object> CheckPassport(string username, string passportNumber)
        {
            var findResult = await _userManager.FindByNameAsync(username);
            if (findResult == null)
            {
                return NotFound("Checking passport failed. Server not found user with this username.");
            }

            if (findResult.NumberOfPassport != null)
            {
                if (findResult.NumberOfPassport.Equals(passportNumber))
                {
                    return Ok(findResult);
                }
                else
                {
                    return NotFound("Passport is incorrect. Please enter a different number of passport.");
                }
            }
            else
            {
                return NotFound("Current user not has passport number yet.");
            }
        }
        #endregion
        #region 9 - Metoda za rezervaciju leta (samo za jednog korisnika)
        [HttpGet]
        [Route("BookAFlight/{username}/{ticketID}")]
        public async Task<Object> BookAFlight(string username, string ticketID)
        {
            var userI = await _userManager.FindByNameAsync(username);
            if (userI == null)
            {
                return NotFound("Booking flight failed. Server not found user in database.");
            }

            var reservedTickets = _context.UserTickets;
            foreach (var ticket in reservedTickets)
            {
                if (ticket.UserName.Equals(long.Parse(userI.Id)) && ticket.TicketID.Equals(long.Parse(ticketID)))
                {
                    return NotFound("Booking flight failed. User already have this ticket in his reservated tickets.");
                }
            }

            UserTickets userTicket = new UserTickets()
            {
                UserName = long.Parse(userI.Id),
                TicketID = long.Parse(ticketID),
                FriendConfirmed = true
            };
            // sam sebi sam prijatelj

            _context.UserTickets.Add(userTicket);
            _context.SaveChanges();

            // sada je potrebno tu kartu postaviti da je rezervisana
            try
            {
                var findTicket = await _context.Tickets.FindAsync(int.Parse(ticketID));
                findTicket.IsTicketPurchased = true;
                findTicket.TimeOfTicketPurchase = DateTime.Now;

                try
                {
                    _context.Tickets.Update(findTicket);
                    _context.SaveChanges();

                    // poeni se dodeljuju useru
                    //PlusPointsForUser(username, "only_flight");
                    var user = await _userManager.FindByNameAsync(username);
                    user.Points += 70;
                    var result = await _userManager.UpdateAsync(user);

                    // avikompanija povecava svoj broj prodatih karata
                    AirlineNumberOfTicketMethod(ticketID, "plus");
                    return Ok();
                }
                catch (Exception e)
                {
                    throw e;
                }
            }
            catch (Exception e)
            {
                throw e;
            }
        }
        #endregion
        #region 10 - Metoda za rezervaciju leta (korisnik + prijatelji)
        [HttpPost]
        [Route("FriendAndMeBookingFlight")]
        public async Task<Object> FriendAndMeBookingFlight(FriendsAndMeModel model)
        {
            string[] friends = model.Friends.Split('|');
            List<string> ticketIDs = model.Tickets.Split('|').ToList();

            #region 10.1 - Prvo sebe unesem u bazu
            // prvo sebe unesem u bazu..metoda isti kod kao prethodna
            var userI = await _userManager.FindByNameAsync(model.Username);
            if (userI == null)
            {
                return NotFound("Booking flight failed. Server not found user in database.");
            }

            var reservedTickets = _context.UserTickets;
            foreach (var ticket in reservedTickets)
            {
                if (ticket.UserName.Equals(long.Parse(userI.Id)) && ticket.TicketID.Equals(long.Parse(ticketIDs[0])))
                {
                    return NotFound("Booking flight failed. User already have this ticket in his reservated tickets.");
                }
            }

            UserTickets userTicket = new UserTickets()
            {
                UserName = long.Parse(userI.Id),
                TicketID = long.Parse(ticketIDs[0]),
                FriendConfirmed = true
            };
            // sam sebi sam prijatelj

            _context.UserTickets.Add(userTicket);
            _context.SaveChanges();

            // sada je potrebno tu kartu postaviti da je rezervisana
            try
            {
                var findTicket = await _context.Tickets.FindAsync(int.Parse(ticketIDs[0]));
                findTicket.IsTicketPurchased = true;
                findTicket.TimeOfTicketPurchase = DateTime.Now;

                try
                {
                    _context.Tickets.Update(findTicket);
                    _context.SaveChanges();

                    var user = await _userManager.FindByNameAsync(model.Username);
                    user.Points += 70;
                    var result = await _userManager.UpdateAsync(user);

                    // avikompanija povecava svoj broj prodatih karata
                    AirlineNumberOfTicketMethod(ticketIDs[0], "plus");
                }
                catch (Exception e)
                {
                    throw e;
                }
            }
            catch (Exception e)
            {
                throw e;
            }
            #endregion
            #region 10.2 - Zatim ubacim i prijatelje

            // prvo izbacim mene
            ticketIDs.RemoveAt(0);

            for (int i = 0; i < ticketIDs.Count; i++)
            {
                var userFriend = await _userManager.FindByNameAsync(friends[i]);
                if (userFriend == null)
                {
                    return NotFound("Booking flight failed. Server not found friend in database.");
                }

                //var reservedTickets = _context.UserTickets;
                foreach (var ticket in reservedTickets)
                {
                    if (ticket.UserName.Equals(long.Parse(userFriend.Id)) && ticket.TicketID.Equals(long.Parse(ticketIDs[i])))
                    {
                        return NotFound("Booking flight failed. Friend already have this ticket in his reservated tickets.");
                    }
                }

                UserTickets newTicket = new UserTickets()
                {
                    UserName = long.Parse(userFriend.Id),
                    TicketID = long.Parse(ticketIDs[i]),
                    FriendConfirmed = false
                };
                // prijatelji ce trebati potvrditi. i pored toga...karta ce biti na cekanju i samim tim je za sada zauzeta

                _context.UserTickets.Add(newTicket);
                _context.SaveChanges();

                // sada je potrebno tu kartu postaviti da je rezervisana
                try
                {
                    var findTicket = await _context.Tickets.FindAsync(int.Parse(ticketIDs[i]));
                    findTicket.IsTicketPurchased = true;
                    findTicket.TimeOfTicketPurchase = DateTime.Now;

                    try
                    {
                        _context.Tickets.Update(findTicket);
                        _context.SaveChanges();

                        //ako je sve u redu..pronadjem mejl od korisnika tj prijatelja i poslajem mu mejl

                        await SendEmailAsync(model.Username, userFriend.Email, findTicket);
                    }
                    catch (Exception e)
                    {
                        throw e;
                    }
                }
                catch (Exception e)
                {
                    throw e;
                }
            }

            #endregion

            return Ok();
        }
        #endregion
        #region 11 - Metoda za slanje mejl prijatelju pri rezervaciji leta
        public async Task SendEmailAsync(string username, string friendMailID, Ticket ticket)
        {
            MailMessage message = new MailMessage();
            SmtpClient smtp = new SmtpClient();
            message.From = new MailAddress(_mailSettings.Mail, _mailSettings.DisplayName);
            message.To.Add(new MailAddress(friendMailID));
            message.Subject = "Confirm flight reservation";
            message.Priority = MailPriority.Normal;

            message.IsBodyHtml = false;

            string ticketInfo = "TicketID: " + ticket.TicketID + "\n" +
                "Ticket number: " + ticket.TicketNumber + "\n" +
                "Ticket price: " + ticket.TicketPrice + "\n\n\n";

            message.Body = ticketInfo + "Your friend " + username + " was send reuqest for reservation flight.\nIf you want to accept this request" +
                " please click on this link: http://localhost:4200/reservationFlightYES/" + ticket.TicketID + "\n" + "If you want to reject this request" +
                " please click on this link: http://localhost:4200/reservationFlightNO/" + ticket.TicketID + "\n\n" + "Thanks for using AvioCarApplication.";

            smtp.Port = _mailSettings.Port;
            smtp.Host = _mailSettings.Host;
            smtp.EnableSsl = true;
            smtp.UseDefaultCredentials = false;
            smtp.Credentials = new NetworkCredential(_mailSettings.Mail, _mailSettings.Password);
            smtp.DeliveryMethod = SmtpDeliveryMethod.Network;
            await smtp.SendMailAsync(message);
        }
        #endregion
        #region 12 - Metoda za potvrdu/odbijanje zahteva za za rezervaciju leta od strane prijatelja
        [HttpGet]
        [Route("ChangeReservationTicket/{ticketID}/{typeChange}")]
        public async Task<Object> ChangeReservationTicket(string ticketID, string typeChange)
        {
            string defaultTime = "1/1/0001 00:00:00";

            var ticket = await _context.Tickets.FindAsync(int.Parse(ticketID));
            if (ticket == null)
            {
                return NotFound("Changing failed. Server not found ticket in data base.");
            }

            var userTicket = new UserTickets();
            var userTickets = _context.UserTickets;
            foreach (var ut in userTickets)
            {
                if (ut.TicketID.Equals(long.Parse(ticketID)))
                {
                    userTicket = ut;
                    break;
                }
            }

            if (typeChange.Equals("yes"))
            {
                long jmbg = -1;
                foreach (var tic in userTickets)
                {
                    if (tic.TicketID == long.Parse(ticketID))
                    {
                        jmbg = tic.UserName;
                    }
                }

                userTicket.FriendConfirmed = true;
                _context.UserTickets.Update(userTicket);
                _context.SaveChanges();

                // povecanje poena
                var user = await _userManager.FindByIdAsync(jmbg.ToString());
                user.Points += 70;
                await _userManager.UpdateAsync(user);

                // avikompanija smanjuje svoj broj prodatih karata
                AirlineNumberOfTicketMethod(ticketID, "plus");
            }
            else
            {
                long jmbg = -1;
                foreach (var tic in userTickets)
                {
                    if (tic.TicketID == long.Parse(ticketID))
                    {
                        jmbg = tic.UserName;
                    }
                }

                ticket.IsTicketPurchased = false;
                ticket.TimeOfTicketPurchase = DateTime.Parse(defaultTime);
                _context.Tickets.Update(ticket);
                _context.SaveChanges();

                _context.UserTickets.Remove(userTicket);
                _context.SaveChanges();

                // umanjenje poena i smanjenje broja prodatih arat, kod odbijanja ne treba..jer nikom nista !!!
            }
            return Ok();
        }
        #endregion        
        #region 13 - Metoda za povecanje/smanjenje broja prodatih karata avikompanije
        public void AirlineNumberOfTicketMethod(string ticketID, string typeOperation)
        {
            var tickets = _context.Tickets.Include(f => f.Flight);
            int flightID = -1;

            foreach (var ticket in tickets)
            {
                if (ticket.TicketID.Equals(int.Parse(ticketID)))
                {
                    flightID = ticket.Flight.FlightID;
                    break;
                }
            }

            int airlineID = -1;
            var flights = _context.Flights.Include(a => a.Airline);

            foreach (var flight in flights)
            {
                if (flight.FlightID.Equals(flightID))
                {
                    airlineID = flight.Airline.AirlineID;
                    break;
                }
            }

            var airline = _context.Airlines.Find(airlineID);
            if (typeOperation.Equals("plus"))
            {
                // povecanje
                airline.NumberOfSoldTickets += 1;
            }
            else
            {
                //smanjenje
                airline.NumberOfSoldTickets -= 1;
            }

            _context.Airlines.Update(airline);
            _context.SaveChanges();
        }
        #endregion
        #region 14 - Metoda za ucitavanje aktivnih/proslih rezervacija
        [HttpGet]
        [Route("LoadReservations/{username}/{loadType}")]
        public async Task<Object> LoadReservations(string username, string loadType)
        {
            var userI = await _userManager.FindByNameAsync(username);
            if (userI == null)
            {
                return NotFound("Loading failed. Server not found user in data base.");
            }

            List<long> ticketsID = new List<long>();
            var ticketUsers = _context.UserTickets;
            foreach (var tu in ticketUsers)
            {
                if (tu.UserName.ToString().Equals(userI.Id))
                {
                    ticketsID.Add(tu.TicketID);
                }
            }

            List<FlightReservationModel> flightReservations = new List<FlightReservationModel>();
            var allTickets = _context.Tickets.Include(f => f.Flight);

            for (int i = 0; i < ticketsID.Count; i++)
            {
                foreach (var ticket in allTickets)
                {
                    // nasao sam tam tiket sa tim id-jem
                    if (ticket.TicketID == (int)ticketsID[i])
                    {
                        if (loadType.Equals("active"))
                        {
                            if ((ticket.Flight.StartTime - DateTime.Now).TotalHours >= 3)
                            {
                                // trebaju mi samo oni aktivni tj oni koji mogu da se otkazu
                                FlightReservationModel newReservation = new FlightReservationModel()
                                {
                                    TicketID = ticket.TicketID.ToString(),
                                    StartTime = ticket.Flight.StartTime.ToString(),
                                    EndTime = ticket.Flight.EndTime.ToString(),
                                    StartLocation = ticket.Flight.StartLocation,
                                    EndLocation = ticket.Flight.EndLocation,
                                    TicketNumber = ticket.TicketNumber.ToString()
                                };

                                if (ticket.CardType == CardType.ECONOMIC_CLASS)
                                {
                                    newReservation.TicketType = "ECONOMIC_CLASS";
                                }
                                else if (ticket.CardType == CardType.FIRST_CLASS)
                                {
                                    newReservation.TicketType = "FIRST_CLASS";
                                }
                                else
                                {
                                    newReservation.TicketType = "BUSINESS_CLASS";
                                }

                                flightReservations.Add(newReservation);
                            }
                        }
                        else
                        {
                            if ((ticket.Flight.StartTime - DateTime.Now).TotalHours < 3)
                            {
                                // trebaju mi samo oni koji vise ne mogu da se otkazu
                                FlightReservationModel newReservation = new FlightReservationModel()
                                {
                                    TicketID = ticket.TicketID.ToString(),
                                    StartTime = ticket.Flight.StartTime.ToString(),
                                    EndTime = ticket.Flight.EndTime.ToString(),
                                    StartLocation = ticket.Flight.StartLocation,
                                    EndLocation = ticket.Flight.EndLocation,
                                    TicketNumber = ticket.TicketNumber.ToString()
                                };

                                if (ticket.CardType == CardType.ECONOMIC_CLASS)
                                {
                                    newReservation.TicketType = "ECONOMIC_CLASS";
                                }
                                else if (ticket.CardType == CardType.FIRST_CLASS)
                                {
                                    newReservation.TicketType = "FIRST_CLASS";
                                }
                                else
                                {
                                    newReservation.TicketType = "BUSINESS_CLASS";
                                }

                                flightReservations.Add(newReservation);
                            }
                        }

                        break;
                    }
                }
            }

            if (flightReservations.Count == 0)
            {
                return NotFound("Loading failed. User not have any active flight reservation.");
            }

            return Ok(flightReservations);
        }
        #endregion
        #region 15 - Metoda za otkazivanje rezervacije
        [HttpDelete]
        [Route("DeleteReservation/{username}/{ticketID}")]
        public async Task<ActionResult<Object>> DeleteReservation(string username, string ticketID)
        {
            var findResult = await _userManager.FindByNameAsync(username);
            if (findResult == null)
            {
                return NotFound("Deleting failed. Server not found current user in data base.");
            }

            var ticketUser = _context.UserTickets.Find(long.Parse(findResult.Id), long.Parse(ticketID));
            if (ticketUser == null)
            {
                return NotFound("Deleting failed. User not have this reserved ticket.");
            }

            var ticket = _context.Tickets.Find(int.Parse(ticketID));
            if (ticket == null)
            {
                return NotFound("Deleting failed. Server not found this ticket in data base.");
            }

            string defaultTime = "1/1/0001 00:00:00";

            try
            {
                _context.UserTickets.Remove(ticketUser);
                _context.SaveChanges();

                ticket.IsTicketPurchased = false;
                ticket.TimeOfTicketPurchase = DateTime.Parse(defaultTime);

                try
                {
                    _context.Tickets.Update(ticket);
                    _context.SaveChanges();

                    //smanjujem poene..posto je otkazana rezervacija
                    var user = await _userManager.FindByNameAsync(username);
                    user.Points -= 70;
                    var result = await _userManager.UpdateAsync(user);

                    // avikompanija smanjuje svoj broj prodatih karata
                    AirlineNumberOfTicketMethod(ticketID, "minus");
                    return Ok(ticket);
                }
                catch (Exception e)
                {
                    throw e;
                }
            }
            catch (Exception e)
            {
                throw e;
            }
        }
        #endregion
        #region 16 - Metoda za ocenjivanje leta odredjene karte tj rezervacije
        [HttpGet]
        [Route("RatingFlight/{ticketID}/{rating}")]
        public async Task<Object> RatingFlight(string ticketID, string rating)
        {
            var tickets = _context.Tickets.Include(f => f.Flight);
            int flightID = -1;

            foreach (var ticket in tickets)
            {
                if (ticket.TicketID == int.Parse(ticketID))
                {
                    flightID = ticket.Flight.FlightID;
                    break;
                }
            }

            if (flightID != -1)
            {
                var flight = await _context.Flights.FindAsync(flightID);
                flight.FlightPrice += int.Parse(rating);
                flight.NumberOfFlightGrades += 1;
                _context.Flights.Update(flight);
                _context.SaveChanges();

                var flights = _context.Flights.Include(a => a.Airline);
                int airlineID = -1;
                foreach (var f in flights)
                {
                    if (f.FlightID == flightID)
                    {
                        airlineID = f.Airline.AirlineID;
                        break;
                    }
                }

                var airline = await _context.Airlines.FindAsync(airlineID);
                airline.AirlinePrice += int.Parse(rating);
                airline.NumberOfAirlineGrades += 1;
                _context.Airlines.Update(airline);
                _context.SaveChanges();


                return Ok();
            }
            else
            {
                return NotFound("Rating flight failed. Server not found flight in data base.");
            }
        }
        #endregion
        #region 17 - Metoda za ucitavanje svih brzih rezervacija leta
        [HttpGet]
        [Route("LoadQuickReservations/{username}")]
        public async Task<Object> LoadQuickReservations(string username)
        {
            var userI = await _userManager.FindByNameAsync(username);
            if (userI == null)
            {
                return NotFound("Loading quick reservation failed. Server not user in data base.");
            }

            double userPoints = userI.Points;

            var tickets = _context.Tickets.Include(f => f.Flight);
            if (tickets == null)
            {
                return NotFound("Loading quick reservation failed. Server not found any ticket in data base.");
            }

            var discount = _context.UserPointsDiscounts.Find("discID");

            List<QuickFlightReservationModel> result = new List<QuickFlightReservationModel>();
            // uzimam sve tikete koji su isQuickBooking
            foreach (var ticket in tickets)
            {
                if (ticket.IsQuickBooking)
                {
                    QuickFlightReservationModel newModel = new QuickFlightReservationModel()
                    {
                        TicketID = ticket.TicketID.ToString(),
                        StartTime = ticket.Flight.StartTime.ToString(),
                        EndTime = ticket.Flight.EndTime.ToString(),
                        StartLocation = ticket.Flight.StartLocation,
                        EndLocation = ticket.Flight.EndLocation,
                        TicketNumber = ticket.TicketNumber.ToString(),
                        TicketPrice = ticket.TicketPrice.ToString()
                    };

                    if (ticket.CardType == CardType.ECONOMIC_CLASS)
                    {
                        newModel.TicketType = "ECONOMIC_CLASS";
                    }
                    else if (ticket.CardType == CardType.FIRST_CLASS)
                    {
                        newModel.TicketType = "FIRST_CLASS";
                    }
                    else
                    {
                        newModel.TicketType = "BUSINESS_CLASS";
                    }

                    double difference = double.Parse(newModel.TicketPrice) * discount.AvioPlusCarReservationDiscounts / 100;
                    newModel.TicketDisountedPrice = (double.Parse(newModel.TicketPrice) - difference).ToString() + "€ / disocunt: " + discount.AvioPlusCarReservationDiscounts + "%";

                    result.Add(newModel);
                }
            }

            if (result.Count == 0) 
            {
                return NotFound("Loading quick reservation flights failed. Server not found any reservation of this type.");
            }

            return Ok(result);
        }
        #endregion
    }
}
