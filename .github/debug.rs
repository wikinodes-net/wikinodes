fn main() {

  let one_day = std::time::Duration::from_secs(60 * 60 * 24);
  println!("one_day: {:?}", one_day);

  let now = std::time::SystemTime::now();
  println!("now: {:?}", now);

  match now.duration_since(std::time::SystemTime::UNIX_EPOCH) {
    Ok(n) => println!("1970-01-01 00:00:00 UTC was {} seconds ago!", n.as_secs()),
    Err(_) => panic!("SystemTime before UNIX EPOCH!"),
  }

  // let now = std::time::Instant::now();
  // println!("now: {:?}", now);

  let some_one_day_ago_by_checked_sub = now.checked_sub(one_day);
  println!("some_one_day_ago_by_checked_sub: {:?}", some_one_day_ago_by_checked_sub);

  let one_day_ago_by_checked_sub = some_one_day_ago_by_checked_sub.unwrap();
  println!("one_day_ago_by_checked_sub: {:?}", one_day_ago_by_checked_sub);

  let one_day_ago_by_subtraction = now - one_day;
  println!("one_day_ago_by_subtraction: {:?}", one_day_ago_by_subtraction);


}
