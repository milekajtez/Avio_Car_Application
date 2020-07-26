using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AvioCarBackend.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AvioCarBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StartController : ControllerBase
    {
        public StartController(ApplicationDbContext context)
        {

        }

        // GET api/start
        [HttpGet]
        public ActionResult<IEnumerable<string>> Get()
        {
            return new string[] { "Server is up" };
        }

        // GET api/start/5
        [HttpGet("{id}")]
        public ActionResult<string> Get(int id)
        {
            return "value";
        }

        // POST api/start
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/start/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/start/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
