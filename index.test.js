import test from 'ava'
import alfyTest from 'alfy-test'

test('should output valid Alfred json', async t => {
  const alfy = alfyTest()
  const results = await alfy('simple')
  t.snapshot(results)
})
