using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AvioCarBackend.Data;
using AvioCarBackend.Data.regular_user;
using AvioCarBackend.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace AvioCarBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegularUserController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<RegisteredUser> _userManager;

        public RegularUserController(ApplicationDbContext context, UserManager<RegisteredUser> userManager)
        {
            _context = context;
            _userManager = userManager;
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

    }
}
