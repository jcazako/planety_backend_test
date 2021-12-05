// return Dummy sanitizer
export default function Sanitizer(users, infos, jobs) {
  this.users = users
  this.infos = infos
  this.jobs = jobs

  this.run = function() {
    return {}
  }
}
