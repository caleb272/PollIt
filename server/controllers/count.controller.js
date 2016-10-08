export function incrementCount(req, res) {
  const count = req.body.count + 1
  res.json({ count })
}
