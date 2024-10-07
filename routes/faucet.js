/**
 * @swagger
 * tags:
 *   name: Claim
 *   description: Claim your tokens
 * /faucet/claim/{address}:
 *   get:
 *     summary: Claim your tokens now
 *     tags: [Claim]
 *     parameters:
 *       - in: path
 *         name: address
 *         schema:
 *           type: string
 *         required: true
 *         description: address to claim
 *     responses:
 *       200:
 *         description: Rerurns transaction informations
 *       500:
 *         description: Error occurred while processing the faucet request
 */
